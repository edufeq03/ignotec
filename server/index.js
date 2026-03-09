import express from 'express';
import cors from 'cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import projectRoutes from './routes/projects.js';
import importRoutes from './routes/import.js';
import { authMiddleware } from './middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

// Ensure directories
mkdirSync(join(__dirname, 'uploads'), { recursive: true });
mkdirSync(join(__dirname, 'data'), { recursive: true });

// ─── Express app init ───────────────────────
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── API Routes ──────────────────────────────
app.use('/api/auth', authRoutes);

// /me requires auth
app.get('/api/auth/me', authMiddleware, (req, res) => res.json({ user: req.user }));

app.use('/api/posts', postRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/import', importRoutes);

// ─── Serve uploaded files ────────────────────
app.use('/api/uploads', express.static(join(__dirname, 'uploads')));

// ─── Serve frontend (production) ─────────────
const distPath = join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('(.*)', (_req, res) => {
        res.sendFile(join(distPath, 'index.html'));
    });
}

// ─── Start ───────────────────────────────────
app.listen(PORT, () => {
    console.log(`🔥 Ignotec API running on http://localhost:${PORT}`);
});
