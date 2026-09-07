import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSchema } from './db.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';
import extendedRoutes from './routes/extended.js';
import uploadRoutes from './routes/uploads.js';
import miscRoutes from './routes/misc.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Handle malformed JSON bodies without crashing
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body.' });
  }
  next(err);
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', extendedRoutes);
app.use('/api', uploadRoutes);
app.use('/api', miscRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong.' });
});

// Start server
async function start() {
  try {
    await initSchema();
    console.log('✅ Database schema ready');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    console.error('Make sure MySQL is running and the database exists. See .env.example.');
    process.exit(1);
  }
}

start();
