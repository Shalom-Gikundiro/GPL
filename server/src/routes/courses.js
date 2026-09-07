import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

// GET /api/subjects
router.get('/subjects', async (req, res) => {
  const rows = await query('SELECT DISTINCT subject AS name FROM courses ORDER BY subject');
  res.json(rows.map(r => r.name));
});

// GET /api/grades
router.get('/grades', async (req, res) => {
  const rows = await query('SELECT DISTINCT grade AS name FROM courses ORDER BY id');
  res.json(rows.map(r => r.name));
});

// GET /api/courses?search=&subject=&grade=
router.get('', async (req, res) => {
  try {
    const { search = '', subject = '', grade = '' } = req.query;
    let sql = 'SELECT * FROM courses WHERE 1=1';
    const params = [];
    if (search) {
      sql += ' AND (title LIKE ? OR subject LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (subject) {
      sql += ' AND subject = ?';
      params.push(subject);
    }
    if (grade) {
      sql += ' AND grade = ?';
      params.push(grade);
    }
    sql += ' ORDER BY id';
    const rows = await query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching courses.' });
  }
});

// GET /api/courses/mine/enrolled (user's enrolled courses)
router.get('/mine/enrolled', authRequired, async (req, res) => {
  try {
    const rows = await query(
      `SELECT c.*, e.progress, e.completed_lessons, e.enrolled_at
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ?
       ORDER BY c.id`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching enrolled courses.' });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM courses WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Course not found.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course.' });
  }
});

// POST /api/courses/:id/enroll
router.post('/:id/enroll', authRequired, async (req, res) => {
  try {
    const courseId = Number(req.params.id);
    const userId = req.user.id;
    const course = await query('SELECT id FROM courses WHERE id = ?', [courseId]);
    if (!course.length) return res.status(404).json({ message: 'Course not found.' });
    await query(
      'INSERT IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [userId, courseId]
    );
    res.json({ message: 'Enrolled successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error enrolling in course.' });
  }
});

export default router;
