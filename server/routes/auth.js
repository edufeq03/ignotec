import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username e password são obrigatórios' });

        // Single-admin: block if user already exists
        const existing = db.prepare('SELECT COUNT(*) as count FROM users').get();
        if (existing.count > 0) return res.status(403).json({ error: 'Registro bloqueado — admin já existe' });

        const hash = bcrypt.hashSync(password, 10);
        const result = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hash);
        const user = { id: result.lastInsertRowid, username };
        const token = generateToken(user);
        res.status(201).json({ user, token });
    } catch (err) {
        if (err.message?.includes('UNIQUE')) return res.status(409).json({ error: 'Usuário já existe' });
        res.status(500).json({ error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Username e password são obrigatórios' });

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

        if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Credenciais inválidas' });

        const token = generateToken({ id: user.id, username: user.username });
        res.json({ user: { id: user.id, username: user.username }, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
    // This is called with auth middleware from index.js
    res.json({ user: req.user });
});

// GET /api/auth/has-users
router.get('/has-users', (_req, res) => {
    const row = db.prepare('SELECT COUNT(*) as count FROM users').get();
    res.json({ hasUsers: row.count > 0 });
});

export default router;
