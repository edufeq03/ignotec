import { Router } from 'express';
import { readFileSync, unlinkSync } from 'fs';
import crypto from 'crypto';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../upload.js';

const router = Router();

// POST /api/projects/import — Upload JSON file to create project(s)
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
    try {
        let data;

        if (req.file) {
            const content = readFileSync(req.file.path, 'utf-8');
            data = JSON.parse(content);
            unlinkSync(req.file.path);
        } else if (req.body.json) {
            data = typeof req.body.json === 'string' ? JSON.parse(req.body.json) : req.body.json;
        } else {
            return res.status(400).json({ error: 'Envie um arquivo JSON ou campo "json"' });
        }

        const items = Array.isArray(data) ? data : [data];
        const created = [];

        for (const item of items) {
            const id = crypto.randomUUID();
            const title = item.titulo || item.title || 'Sem Título';
            const description = item.descricao || item.description || '';
            const category = item.categoria || item.category || 'Web';
            const status = item.status || 'planejamento';
            const techs = JSON.stringify(item.tecnologias || item.techs || []);
            const link = item.link || null;
            const visible = item.visivel || item.visible ? 1 : 0;

            const interno = item._interno || item.interno || {};
            const publico_alvo = interno.publico_alvo || item.publico_alvo || null;
            const dinamica = interno.dinamica || item.dinamica || null;
            const motivacoes = interno.motivacoes || item.motivacoes || null;
            const notas = interno.notas || item.notas || null;
            const cliente = interno.cliente || item.cliente || null;
            const prazo = interno.prazo || item.prazo || null;

            db.prepare(`
        INSERT INTO projects (id, title, description, category, status, techs, link, visible,
                              publico_alvo, dinamica, motivacoes, notas, cliente, prazo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, description, category, status, techs, link, visible,
                publico_alvo, dinamica, motivacoes, notas, cliente, prazo);

            const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
            created.push({
                ...project,
                techs: JSON.parse(project.techs || '[]'),
                visible: !!project.visible,
            });
        }

        res.status(201).json({ imported: created.length, projects: created });
    } catch (err) {
        res.status(400).json({ error: `Erro ao importar: ${err.message}` });
    }
});

export default router;
