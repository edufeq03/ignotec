import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../upload.js';

const router = Router();

function parseProject(row) {
    if (!row) return null;
    return {
        ...row,
        techs: JSON.parse(row.techs || '[]'),
        visible: !!row.visible,
    };
}

// GET /api/projects — public (visible only) or all (admin)
router.get('/', (req, res) => {
    try {
        let isAdmin = false;
        const header = req.headers.authorization;
        if (header && header.startsWith('Bearer ')) {
            try {
                jwt.verify(header.slice(7), process.env.JWT_SECRET || 'ignotec-dev-secret-change-in-prod');
                isAdmin = true;
            } catch { }
        }

        const onlyVisible = !isAdmin || req.query.visible === 'true';
        const rows = onlyVisible
            ? db.prepare('SELECT * FROM projects WHERE visible = 1 ORDER BY created_at DESC').all()
            : db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();

        if (isAdmin) {
            res.json(rows.map(parseProject));
        } else {
            res.json(rows.map(row => ({
                id: row.id, title: row.title, description: row.description,
                category: row.category, image: row.image, link: row.link,
                techs: JSON.parse(row.techs || '[]'), visible: !!row.visible
            })));
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/projects/:id
router.get('/:id', (req, res) => {
    try {
        const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
        if (!row) return res.status(404).json({ error: 'Projeto não encontrado' });
        res.json(parseProject(row));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/projects (auth required, multipart)
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
    try {
        const { title, description, category, status, techs, link, visible,
            publico_alvo, dinamica, motivacoes, notas, cliente, prazo } = req.body;
        if (!title || !description) return res.status(400).json({ error: 'Nome e descrição obrigatórios' });

        const id = crypto.randomUUID();
        const techsJson = JSON.stringify(techs ? (typeof techs === 'string' ? JSON.parse(techs) : techs) : []);
        const image = req.file ? `/api/uploads/${req.file.filename}` : null;

        db.prepare(`
      INSERT INTO projects (id, title, description, category, status, techs, link, visible, image,
                            publico_alvo, dinamica, motivacoes, notas, cliente, prazo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            id, title, description, category || 'Web', status || 'planejamento', techsJson,
            link || null, visible === 'true' || visible === true ? 1 : 0, image,
            publico_alvo || null, dinamica || null, motivacoes || null, notas || null, cliente || null, prazo || null
        );

        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        res.status(201).json(parseProject(project));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/projects/:id (auth required, multipart)
router.put('/:id', authMiddleware, upload.single('image'), (req, res) => {
    try {
        const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Projeto não encontrado' });

        const { title, description, category, status, techs, link, visible,
            publico_alvo, dinamica, motivacoes, notas, cliente, prazo } = req.body;
        const techsJson = techs ? JSON.stringify(typeof techs === 'string' ? JSON.parse(techs) : techs) : existing.techs;
        const image = req.file ? `/api/uploads/${req.file.filename}` : (req.body.image ?? existing.image);

        db.prepare(`
      UPDATE projects SET title=?, description=?, category=?, status=?, techs=?, link=?, visible=?, image=?,
                          publico_alvo=?, dinamica=?, motivacoes=?, notas=?, cliente=?, prazo=?,
                          updated_at=datetime('now')
      WHERE id=?
    `).run(
            title ?? existing.title, description ?? existing.description, category ?? existing.category,
            status ?? existing.status, techsJson, link ?? existing.link,
            visible !== undefined ? (visible === 'true' || visible === true ? 1 : 0) : existing.visible,
            image,
            publico_alvo ?? existing.publico_alvo, dinamica ?? existing.dinamica,
            motivacoes ?? existing.motivacoes, notas ?? existing.notas,
            cliente ?? existing.cliente, prazo ?? existing.prazo,
            req.params.id
        );

        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
        res.json(parseProject(project));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/projects/:id (auth required)
router.delete('/:id', authMiddleware, (req, res) => {
    try {
        const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
