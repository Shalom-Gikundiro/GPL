import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Teacher access required.' });
  next();
};

const isParent = (req, res, next) => {
  if (req.user.role !== 'parent') return res.status(403).json({ message: 'Parent access required.' });
  next();
};

// GET /api/teacher/my-courses
router.get('/my-courses', authRequired, isTeacher, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM courses WHERE teacher_id = ? ORDER BY id', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching courses.' });
  }
});

// GET /api/teacher/students
router.get('/students', authRequired, isTeacher, async (req, res) => {
  try {
    const rows = await query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.grade, u.country,
              e.progress, e.completed_lessons, c.title as course_title
       FROM enrollments e
       JOIN users u ON u.id = e.user_id
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ?
       ORDER BY u.last_name, u.first_name`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching students.' });
  }
});

// GET /api/teacher/stats
router.get('/stats', authRequired, isTeacher, async (req, res) => {
  try {
    const [classes] = await query('SELECT COUNT(*) AS total FROM courses WHERE teacher_id = ?', [req.user.id]);
    const [students] = await query(
      `SELECT COUNT(DISTINCT e.user_id) AS total
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ?`,
      [req.user.id]
    );
    const [submissions] = await query(
      `SELECT COUNT(*) AS total
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ? AND e.completed_lessons < c.lessons`,
      [req.user.id]
    );
    res.json({
      classes: classes.total,
      students: students.total,
      pendingSubmissions: submissions.total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stats.' });
  }
});

// GET /api/parent/children
router.get('/children', authRequired, isParent, async (req, res) => {
  try {
    const rows = await query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.grade, u.country, u.coins, u.xp
       FROM parent_children pc
       JOIN users u ON u.id = pc.child_id
       WHERE pc.parent_id = ?
       ORDER BY u.last_name, u.first_name`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching children.' });
  }
});

// GET /api/parent/child-progress/:childId
router.get('/child-progress/:childId', authRequired, isParent, async (req, res) => {
  try {
    const childId = Number(req.params.childId);
    const child = await query(
      `SELECT u.id, u.first_name, u.last_name, u.grade, u.country, u.coins, u.xp
       FROM parent_children pc
       JOIN users u ON u.id = pc.child_id
       WHERE pc.parent_id = ? AND pc.child_id = ?`,
      [req.user.id, childId]
    );
    if (!child.length) return res.status(404).json({ message: 'Child not found.' });

    const enrollments = await query(
      `SELECT c.title, c.subject, e.progress, e.completed_lessons, c.lessons
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ?`,
      [childId]
    );

    const avgProgress = enrollments.length
      ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
      : 0;

    res.json({ child: child[0], enrollments, avgProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching child progress.' });
  }
});

// POST /api/parent/link-child
router.post('/parent/link-child', authRequired, isParent, async (req, res) => {
  try {
    const { childUsernameOrEmail } = req.body;
    if (!childUsernameOrEmail) {
      return res.status(400).json({ message: 'Child username or email is required.' });
    }
    const child = await query(
      'SELECT id, first_name, last_name FROM users WHERE (username = ? OR email = ?) AND role = ?',
      [childUsernameOrEmail, childUsernameOrEmail, 'student']
    );
    if (!child.length) {
      return res.status(404).json({ message: 'Student not found. Make sure they registered as a student.' });
    }
    const existing = await query('SELECT id FROM parent_children WHERE parent_id = ? AND child_id = ?', [req.user.id, child[0].id]);
    if (existing.length) {
      return res.status(409).json({ message: 'This child is already linked to your account.' });
    }
    await query('INSERT INTO parent_children (parent_id, child_id) VALUES (?, ?)', [req.user.id, child[0].id]);
    res.json({ message: 'Child linked successfully!', child: child[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error linking child.' });
  }
});

// POST /api/parent/unlink-child/:childId
router.post('/parent/unlink-child/:childId', authRequired, isParent, async (req, res) => {
  try {
    const childId = Number(req.params.childId);
    await query('DELETE FROM parent_children WHERE parent_id = ? AND child_id = ?', [req.user.id, childId]);
    res.json({ message: 'Child unlinked successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error unlinking child.' });
  }
});

// POST /api/student/link-parent
router.post('/student/link-parent', authRequired, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can link a parent.' });
    }
    const { parentUsernameOrEmail } = req.body;
    if (!parentUsernameOrEmail) {
      return res.status(400).json({ message: 'Parent username or email is required.' });
    }
    const parent = await query(
      'SELECT id, first_name, last_name FROM users WHERE (username = ? OR email = ?) AND role = ?',
      [parentUsernameOrEmail, parentUsernameOrEmail, 'parent']
    );
    if (!parent.length) {
      return res.status(404).json({ message: 'Parent not found. Make sure they registered as a parent.' });
    }
    const existing = await query('SELECT id FROM parent_children WHERE parent_id = ? AND child_id = ?', [parent[0].id, req.user.id]);
    if (existing.length) {
      return res.status(409).json({ message: 'You are already linked to this parent.' });
    }
    await query('INSERT INTO parent_children (parent_id, child_id) VALUES (?, ?)', [parent[0].id, req.user.id]);
    res.json({ message: 'Parent linked successfully!', parent: parent[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error linking parent.' });
  }
});

export default router;
