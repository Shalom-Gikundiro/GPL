import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed.'));
    }
  }
});

// POST /api/upload
router.post('/upload', authRequired, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    const { title, description, gradeLevel, subject } = req.body;
    const result = await query(
      `INSERT INTO library_files (title, description, filename, filepath, filetype, filesize, uploaded_by, grade_level, subject)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title || req.file.originalname,
        description || '',
        req.file.filename,
        req.file.path,
        req.file.mimetype,
        req.file.size,
        req.user.id,
        gradeLevel || null,
        subject || null
      ]
    );
    res.status(201).json({
      id: result.insertId,
      title: title || req.file.originalname,
      description,
      filename: req.file.filename,
      filetype: req.file.mimetype,
      filesize: req.file.size,
      gradeLevel,
      subject,
      uploadedBy: req.user.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading file.' });
  }
});

// GET /api/library
router.get('/library', async (req, res) => {
  try {
    const { grade, subject } = req.query;
    let sql = `SELECT lf.*, u.first_name, u.last_name FROM library_files lf JOIN users u ON u.id = lf.uploaded_by WHERE 1=1`;
    const params = [];
    if (grade) {
      sql += ' AND lf.grade_level = ?';
      params.push(grade);
    }
    if (subject) {
      sql += ' AND lf.subject = ?';
      params.push(subject);
    }
    sql += ' ORDER BY lf.created_at DESC';
    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching library.' });
  }
});

// GET /api/library/:id
router.get('/library/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM library_files WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'File not found.' });
    await query('UPDATE library_files SET downloads = downloads + 1 WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching file.' });
  }
});

// DELETE /api/library/:id
router.delete('/library/:id', authRequired, async (req, res) => {
  try {
    const file = await query('SELECT * FROM library_files WHERE id = ?', [req.params.id]);
    if (!file.length) return res.status(404).json({ message: 'File not found.' });
    if (file[0].uploaded_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this file.' });
    }
    await query('DELETE FROM library_files WHERE id = ?', [req.params.id]);
    res.json({ message: 'File deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting file.' });
  }
});

// ==================== LIVE SESSIONS ====================

// POST /api/live-sessions
router.post('/live-sessions', authRequired, async (req, res) => {
  try {
    const { title, description, subject, grade, scheduledAt, streamUrl } = req.body;
    const result = await query(
      `INSERT INTO live_sessions (title, description, subject, grade, teacher_id, scheduled_at, stream_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description || '', subject || '', grade || '', req.user.id, scheduledAt || null, streamUrl || '']
    );
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      subject,
      grade,
      teacherId: req.user.id,
      scheduledAt,
      streamUrl,
      status: 'scheduled'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating live session.' });
  }
});

// GET /api/live-sessions
router.get('/live-sessions', async (req, res) => {
  try {
    const { status, grade, subject } = req.query;
    let sql = `SELECT ls.*, u.first_name, u.last_name FROM live_sessions ls JOIN users u ON u.id = ls.teacher_id WHERE 1=1`;
    const params = [];
    if (status) {
      sql += ' AND ls.status = ?';
      params.push(status);
    }
    if (grade) {
      sql += ' AND ls.grade = ?';
      params.push(grade);
    }
    if (subject) {
      sql += ' AND ls.subject = ?';
      params.push(subject);
    }
    sql += ' ORDER BY ls.scheduled_at DESC';
    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching live sessions.' });
  }
});

// GET /api/live-sessions/:id
router.get('/live-sessions/:id', async (req, res) => {
  try {
    const rows = await query('SELECT ls.*, u.first_name, u.last_name FROM live_sessions ls JOIN users u ON u.id = ls.teacher_id WHERE ls.id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Session not found.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching session.' });
  }
});

// PUT /api/live-sessions/:id/start
router.put('/live-sessions/:id/start', authRequired, async (req, res) => {
  try {
    const session = await query('SELECT * FROM live_sessions WHERE id = ?', [req.params.id]);
    if (!session.length) return res.status(404).json({ message: 'Session not found.' });
    if (session[0].teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the teacher can start this session.' });
    }
    await query("UPDATE live_sessions SET status = 'live' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Session started.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error starting session.' });
  }
});

// PUT /api/live-sessions/:id/end
router.put('/live-sessions/:id/end', authRequired, async (req, res) => {
  try {
    const session = await query('SELECT * FROM live_sessions WHERE id = ?', [req.params.id]);
    if (!session.length) return res.status(404).json({ message: 'Session not found.' });
    if (session[0].teacher_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the teacher can end this session.' });
    }
    await query("UPDATE live_sessions SET status = 'ended' WHERE id = ?", [req.params.id]);
    res.json({ message: 'Session ended.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error ending session.' });
  }
});

// POST /api/live-sessions/:id/join
router.post('/live-sessions/:id/join', authRequired, async (req, res) => {
  try {
    const session = await query('SELECT * FROM live_sessions WHERE id = ?', [req.params.id]);
    if (!session.length) return res.status(404).json({ message: 'Session not found.' });
    if (session[0].status !== 'live') {
      return res.status(400).json({ message: 'This session is not live.' });
    }
    await query('INSERT IGNORE INTO session_attendees (session_id, user_id) VALUES (?, ?)', [req.params.id, req.user.id]);
    res.json({ message: 'Joined session.', streamUrl: session[0].stream_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error joining session.' });
  }
});

// GET /api/live-sessions/:id/attendees
router.get('/live-sessions/:id/attendees', authRequired, async (req, res) => {
  try {
    const rows = await query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.role, sa.joined_at
       FROM session_attendees sa
       JOIN users u ON u.id = sa.user_id
       WHERE sa.session_id = ?
       ORDER BY sa.joined_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching attendees.' });
  }
});

export default router;
