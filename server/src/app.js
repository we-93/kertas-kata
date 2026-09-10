import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Konfigurasi CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static route untuk file uploads (gambar, pdf, cover)
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Static route untuk frontend (index.html, dashboard.html, css/, js/)
const frontendPath = path.resolve(__dirname, '../../');

// Clean URL Handler (mendukung rute tanpa .html seperti /elearning, /elearning/, /kelola-komunitas, dll)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();

  const cleanPath = req.path.replace(/\/+$/, '');
  if (!cleanPath) {
    return res.sendFile(path.join(frontendPath, 'index.html'));
  }

  const htmlFile = path.join(frontendPath, `${cleanPath}.html`);
  if (fs.existsSync(htmlFile)) {
    return res.sendFile(htmlFile);
  }
  next();
});

app.use(express.static(frontendPath, { extensions: ['html'] }));

// API Routes
app.use('/api', routes);

// Welcome / Root route fallback
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan di server API.`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
