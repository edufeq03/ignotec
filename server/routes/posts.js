import { Router } from 'express';
import crypto from 'crypto';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../upload.js';

const router = Router();

// GET /api/posts — public (only published) or all (if authed)
router.get('/', (req, res) => {
    try {
        const onlyPublished = req.query.status === 'publicado';
        const rows = onlyPublished
            ? db.prepare('SELECT * FROM posts WHERE status = ? ORDER BY created_at DESC').all('publicado')
            : db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
        const posts = rows.map(r => ({ ...r, tags: JSON.parse(r.tags || '[]') }));
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/posts/:id
router.get('/:id', (req, res) => {
    try {
        const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
        if (!row) return res.status(404).json({ error: 'Post não encontrado' });
        res.json({ ...row, tags: JSON.parse(row.tags || '[]') });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/posts (auth required)
router.post('/', authMiddleware, upload.single('cover_image'), (req, res) => {
    try {
        const { title, content, category, tags, status } = req.body;
        if (!title || !content) return res.status(400).json({ error: 'Título e conteúdo obrigatórios' });

        const id = crypto.randomUUID();
        const tagsJson = JSON.stringify(tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : []);
        const coverImage = req.file ? `/api/uploads/${req.file.filename}` : null;

        db.prepare(`
      INSERT INTO posts (id, title, content, category, tags, status, cover_image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, title, content, category || 'desenvolvimento', tagsJson, status || 'rascunho', coverImage);

        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
        res.status(201).json({ ...post, tags: JSON.parse(post.tags) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/posts/:id (auth required)
router.put('/:id', authMiddleware, upload.single('cover_image'), (req, res) => {
    try {
        const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Post não encontrado' });

        const { title, content, category, tags, status } = req.body;
        const tagsJson = tags ? JSON.stringify(typeof tags === 'string' ? JSON.parse(tags) : tags) : existing.tags;
        const coverImage = req.file ? `/api/uploads/${req.file.filename}` : (req.body.cover_image ?? existing.cover_image);

        db.prepare(`
      UPDATE posts SET title=?, content=?, category=?, tags=?, status=?, cover_image=?, updated_at=datetime('now')
      WHERE id=?
    `).run(
            title || existing.title, content || existing.content, category || existing.category,
            tagsJson, status || existing.status, coverImage, req.params.id
        );

        const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
        res.json({ ...post, tags: JSON.parse(post.tags) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/posts/:id (auth required)
router.delete('/:id', authMiddleware, (req, res) => {
    try {
        const result = db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Post não encontrado' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
