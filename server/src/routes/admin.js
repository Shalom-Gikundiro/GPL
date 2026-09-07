import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  next();
};

// GET /api/admin/stats
router.get('/stats', authRequired, isAdmin, async (req, res) => {
  try {
    const [users] = await query('SELECT COUNT(*) AS total FROM users');
    const [courses] = await query('SELECT COUNT(*) AS total FROM courses');
    const [enrollments] = await query('SELECT COUNT(*) AS total FROM enrollments');
    const [messages] = await query('SELECT COUNT(*) AS total FROM messages');
    const [newsletter] = await query('SELECT COUNT(*) AS total FROM newsletter_subscribers');
    const [recentUsers] = await query('SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    const [recentEnrollments] = await query('SELECT e.id, u.first_name, u.last_name, c.title, e.enrolled_at FROM enrollments e JOIN users u ON u.id = e.user_id JOIN courses c ON c.id = e.course_id ORDER BY e.enrolled_at DESC LIMIT 5');
    res.json({
      totals: { users: users.total, courses: courses.total, enrollments: enrollments.total, messages: messages.total, newsletter: newsletter.total },
      recentUsers,
      recentEnrollments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching admin stats.' });
  }
});

// GET /api/admin/users
router.get('/users', authRequired, isAdmin, async (req, res) => {
  try {
    const rows = await query('SELECT id, first_name, last_name, email, username, role, country, grade, coins, xp, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// GET /api/admin/courses
router.get('/courses', authRequired, isAdmin, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM courses ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching courses.' });
  }
});

export default router;
