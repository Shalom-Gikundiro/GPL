import { Router } from 'express';
import { query } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Student access required.' });
  next();
};

const isParent = (req, res, next) => {
  if (req.user.role !== 'parent') return res.status(403).json({ message: 'Parent access required.' });
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Teacher access required.' });
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  next();
};

// ==================== STUDENT ====================

// GET /api/student/progress
router.get('/student/progress', authRequired, isStudent, async (req, res) => {
  try {
    const rows = await query(
      `SELECT c.title, c.subject, c.lessons, e.progress, e.completed_lessons, e.enrolled_at
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ?
       ORDER BY e.enrolled_at DESC`,
      [req.user.id]
    );
    const avg = rows.length ? Math.round(rows.reduce((s, r) => s + (r.progress || 0), 0) / rows.length) : 0;
    res.json({ courses: rows, avgProgress: avg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching progress.' });
  }
});

// GET /api/student/achievements
router.get('/student/achievements', authRequired, isStudent, async (req, res) => {
  try {
    const [user] = await query('SELECT coins, xp FROM users WHERE id = ?', [req.user.id]);
    const badges = Math.floor((user?.xp || 0) / 100);
    const achievements = [
      { id: 1, title: 'First Steps', desc: 'Enrolled in your first course', unlocked: true },
      { id: 2, title: 'Bookworm', desc: 'Completed 5 lessons', unlocked: (user?.xp || 0) >= 100 },
      { id: 3, title: 'Math Wizard', desc: 'Scored 90% in Mathematics', unlocked: false },
      { id: 4, title: 'Streak Master', desc: '7-day learning streak', unlocked: false },
      { id: 5, title: 'Quiz Champion', desc: 'Aced 10 quizzes', unlocked: false },
      { id: 6, title: 'Helper', desc: 'Helped 5 classmates', unlocked: false },
    ];
    res.json({ badges, coins: user?.coins || 0, xp: user?.xp || 0, achievements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching achievements.' });
  }
});

// GET /api/student/leaderboard
router.get('/student/leaderboard', authRequired, isStudent, async (req, res) => {
  try {
    const rows = await query(
      `SELECT u.first_name, u.last_name, u.xp, u.coins,
              COUNT(e.id) AS courses
       FROM users u
       LEFT JOIN enrollments e ON e.user_id = u.id
       WHERE u.role = 'student'
       GROUP BY u.id
       ORDER BY u.xp DESC
       LIMIT 20`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leaderboard.' });
  }
});

// GET /api/student/notifications
router.get('/student/notifications', authRequired, isStudent, async (req, res) => {
  try {
    const notifications = [
      { id: 1, title: 'New course available', message: 'Science Experiments course is now open for enrollment.', time: '2 hours ago', read: false },
      { id: 2, title: 'Assignment due', message: 'Math Worksheet 5 is due tomorrow.', time: '1 day ago', read: false },
      { id: 3, title: 'Achievement unlocked', message: 'You earned the "Bookworm" badge!', time: '2 days ago', read: true },
    ];
    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications.' });
  }
});

// GET /api/student/assignments
router.get('/student/assignments', authRequired, isStudent, async (req, res) => {
  try {
    const assignments = [
      { id: 1, title: 'Math Worksheet 5', course: 'Counting & Numbers', due: '2026-08-25', status: 'pending' },
      { id: 2, title: 'Science Quiz', course: 'Science Experiments', due: '2026-08-28', status: 'pending' },
      { id: 3, title: 'Reading Report', course: 'Reading Adventures', due: '2026-08-20', status: 'graded', grade: 'A' },
    ];
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching assignments.' });
  }
});

// GET /api/student/exams
router.get('/student/exams', authRequired, isStudent, async (req, res) => {
  try {
    const exams = [
      { id: 1, subject: 'Mathematics', score: 92, grade: 'A', status: 'completed' },
      { id: 2, subject: 'English', score: 88, grade: 'B+', status: 'completed' },
      { id: 3, subject: 'Science', score: 75, grade: 'C+', status: 'completed' },
      { id: 4, subject: 'History', score: 88, grade: 'B+', status: 'completed' },
    ];
    res.json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching exams.' });
  }
});

// GET /api/student/certificates
router.get('/student/certificates', authRequired, isStudent, async (req, res) => {
  try {
    const rows = await query(
      `SELECT c.title, c.subject, e.progress, e.completed_lessons, c.lessons
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ? AND e.progress >= 100`,
      [req.user.id]
    );
    const certificates = rows.map(r => ({
      id: r.id,
      title: r.title,
      subject: r.subject,
      date: new Date().toLocaleDateString(),
      verified: true
    }));
    res.json(certificates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching certificates.' });
  }
});

// GET /api/student/lessons
router.get('/student/lessons', authRequired, isStudent, async (req, res) => {
  try {
    const rows = await query(
      `SELECT c.id, c.title, c.subject, c.lessons, e.progress, e.completed_lessons
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE e.user_id = ? AND e.progress < 100
       ORDER BY e.progress DESC`,
      [req.user.id]
    );
    const lessons = rows.flatMap(c =>
      Array.from({ length: c.lessons }, (_, i) => ({
        id: `${c.id}-${i + 1}`,
        courseId: c.id,
        course: c.title,
        subject: c.subject,
        number: i + 1,
        total: c.lessons,
        completed: i < (c.completed_lessons || 0),
        locked: i > (c.completed_lessons || 0)
      }))
    );
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching lessons.' });
  }
});

// ==================== PARENT ====================

// GET /api/parent/progress
router.get('/parent/progress', authRequired, isParent, async (req, res) => {
  try {
    const children = await query(
      `SELECT u.id, u.first_name, u.last_name, u.grade
       FROM parent_children pc
       JOIN users u ON u.id = pc.child_id
       WHERE pc.parent_id = ?`,
      [req.user.id]
    );
    const result = [];
    for (const child of children) {
      const enrollments = await query(
        `SELECT c.title, c.subject, e.progress, e.completed_lessons, c.lessons
         FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         WHERE e.user_id = ?`,
        [child.id]
      );
      const avg = enrollments.length ? Math.round(enrollments.reduce((s, e) => s + (e.progress || 0), 0) / enrollments.length) : 0;
      result.push({ ...child, enrollments, avgProgress: avg });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching progress.' });
  }
});

// GET /api/parent/attendance
router.get('/parent/attendance', authRequired, isParent, async (req, res) => {
  try {
    const children = await query(
      `SELECT u.id, u.first_name, u.last_name
       FROM parent_children pc
       JOIN users u ON u.id = pc.child_id
       WHERE pc.parent_id = ?`,
      [req.user.id]
    );
    const attendance = children.map(c => ({
      ...c,
      days: [
        { day: 'Monday', status: 'present' },
        { day: 'Tuesday', status: 'present' },
        { day: 'Wednesday', status: 'present' },
        { day: 'Thursday', status: 'present' },
        { day: 'Friday', status: Math.random() > 0.5 ? 'present' : 'absent' }
      ],
      percentage: Math.floor(Math.random() * 20) + 80
    }));
    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching attendance.' });
  }
});

// GET /api/parent/grades
router.get('/parent/grades', authRequired, isParent, async (req, res) => {
  try {
    const children = await query(
      `SELECT u.id, u.first_name, u.last_name
       FROM parent_children pc
       JOIN users u ON u.id = pc.child_id
       WHERE pc.parent_id = ?`,
      [req.user.id]
    );
    const result = [];
    for (const child of children) {
      const enrollments = await query(
        `SELECT c.title, c.subject, e.progress, e.completed_lessons, c.lessons
         FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         WHERE e.user_id = ?`,
        [child.id]
      );
      result.push({ ...child, grades: enrollments.map(e => ({
        subject: e.subject,
        score: e.progress || 0,
        grade: (e.progress || 0) >= 80 ? 'A' : (e.progress || 0) >= 50 ? 'B' : 'C'
      }))});
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching grades.' });
  }
});

// GET /api/parent/messages
router.get('/parent/messages', authRequired, isParent, async (req, res) => {
  try {
    const messages = [
      { id: 1, from: 'Teacher Kofi', avatar: 'TK', text: 'Amara is doing great in Mathematics! Keep encouraging her to practice multiplication at home.', time: '2 hours ago' },
      { id: 2, from: 'Ms. Laura', avatar: 'ML', text: 'Please remind Amara to bring her art supplies for the upcoming project.', time: 'Yesterday' },
    ];
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages.' });
  }
});

// GET /api/parent/events
router.get('/parent/events', authRequired, isParent, async (req, res) => {
  try {
    const events = [
      { id: 1, title: 'Parent-Teacher Meeting', date: '2026-08-22', time: '2:00 PM', type: 'meeting' },
      { id: 2, title: 'Science Fair', date: '2026-08-25', time: '10:00 AM', type: 'event' },
      { id: 3, title: 'Sports Day', date: '2026-09-01', time: '9:00 AM', type: 'event' },
    ];
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching events.' });
  }
});

// GET /api/parent/billing
router.get('/parent/billing', authRequired, isParent, async (req, res) => {
  try {
    const billing = [
      { id: 1, date: '2026-08-01', desc: 'Monthly Plan - August', amount: 5.00, status: 'paid' },
      { id: 2, date: '2026-07-01', desc: 'Monthly Plan - July', amount: 5.00, status: 'paid' },
      { id: 3, date: '2026-09-01', desc: 'Monthly Plan - September', amount: 5.00, status: 'upcoming' },
    ];
    res.json(billing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching billing.' });
  }
});

// PUT /api/parent/settings
router.put('/parent/settings', authRequired, isParent, async (req, res) => {
  try {
    const { notifications, emailReports, smsAlerts } = req.body;
    res.json({ message: 'Settings updated successfully.', settings: { notifications, emailReports, smsAlerts } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating settings.' });
  }
});

// ==================== TEACHER ====================

// GET /api/teacher/assignments
router.get('/teacher/assignments', authRequired, isTeacher, async (req, res) => {
  try {
    const rows = await query(
      `SELECT c.id, c.title, c.subject, COUNT(e.id) AS submissions, c.lessons
       FROM courses c
       LEFT JOIN enrollments e ON e.course_id = c.id
       WHERE c.teacher_id = ?
       GROUP BY c.id`,
      [req.user.id]
    );
    const assignments = rows.map(r => ({
      id: r.id,
      title: r.title,
      subject: r.subject,
      submissions: r.submissions,
      totalStudents: r.submissions,
      status: 'active'
    }));
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching assignments.' });
  }
});

// GET /api/teacher/grading
router.get('/teacher/grading', authRequired, isTeacher, async (req, res) => {
  try {
    const rows = await query(
      `SELECT u.first_name, u.last_name, c.title AS course_title, e.progress, e.completed_lessons, c.lessons
       FROM enrollments e
       JOIN users u ON u.id = e.user_id
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ?
       ORDER BY e.completed_lessons DESC`,
      [req.user.id]
    );
    const grading = rows.map(r => ({
      student: `${r.first_name} ${r.last_name}`,
      course: r.course_title,
      completed: r.completed_lessons,
      total: r.lessons,
      status: r.completed_lessons >= r.lessons ? 'graded' : 'pending'
    }));
    res.json(grading);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching grading data.' });
  }
});

// GET /api/teacher/schedule
router.get('/teacher/schedule', authRequired, isTeacher, async (req, res) => {
  try {
    const courses = await query('SELECT * FROM courses WHERE teacher_id = ? ORDER BY id', [req.user.id]);
    const schedule = courses.map((c, i) => ({
      id: c.id,
      time: `${8 + i}:00`,
      title: c.title,
      grade: c.grade,
      subject: c.subject,
      duration: '45 mins',
      level: c.level
    }));
    res.json(schedule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching schedule.' });
  }
});

// GET /api/teacher/messages
router.get('/teacher/messages', authRequired, isTeacher, async (req, res) => {
  try {
    const messages = [
      { id: 1, from: 'Parent Jean', avatar: 'PJ', text: 'When is the next parent-teacher meeting?', time: '1 hour ago', read: false },
      { id: 2, from: 'Admin', avatar: 'A', text: 'Please submit your lesson plans for next week.', time: 'Yesterday', read: true },
    ];
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages.' });
  }
});

// GET /api/teacher/resources
router.get('/teacher/resources', authRequired, isTeacher, async (req, res) => {
  try {
    const resources = [
      { id: 1, title: 'Math Worksheet Template', type: 'pdf', size: '2.4 MB' },
      { id: 2, title: 'Science Experiment Guide', type: 'pdf', size: '5.1 MB' },
      { id: 3, title: 'English Grammar Cheat Sheet', type: 'pdf', size: '1.2 MB' },
    ];
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching resources.' });
  }
});

// GET /api/teacher/reports
router.get('/teacher/reports', authRequired, isTeacher, async (req, res) => {
  try {
    const [classes] = await query('SELECT COUNT(*) AS total FROM courses WHERE teacher_id = ?', [req.user.id]);
    const [students] = await query(
      `SELECT COUNT(DISTINCT e.user_id) AS total
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ?`,
      [req.user.id]
    );
    const [avgProgress] = await query(
      `SELECT AVG(e.progress) AS avg
       FROM enrollments e
       JOIN courses c ON c.id = e.course_id
       WHERE c.teacher_id = ?`,
      [req.user.id]
    );
    res.json({
      totalClasses: classes.total,
      totalStudents: students.total,
      avgProgress: Math.round(avgProgress.avg || 0),
      completionRate: Math.round((avgProgress.avg || 0)) + '%'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reports.' });
  }
});

// ==================== ADMIN ====================

// GET /api/admin/enrollments
router.get('/enrollments', authRequired, isAdmin, async (req, res) => {
  try {
    const rows = await query(
      `SELECT e.id, u.first_name, u.last_name, c.title, e.progress, e.completed_lessons, e.enrolled_at
       FROM enrollments e
       JOIN users u ON u.id = e.user_id
       JOIN courses c ON c.id = e.course_id
       ORDER BY e.enrolled_at DESC
       LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching enrollments.' });
  }
});

// GET /api/admin/reports
router.get('/reports', authRequired, isAdmin, async (req, res) => {
  try {
    const [users] = await query('SELECT COUNT(*) AS total FROM users');
    const [courses] = await query('SELECT COUNT(*) AS total FROM courses');
    const [enrollments] = await query('SELECT COUNT(*) AS total FROM enrollments');
    const [activeUsers] = await query("SELECT COUNT(*) AS total FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    res.json({
      totalUsers: users.total,
      totalCourses: courses.total,
      totalEnrollments: enrollments.total,
      activeUsers: activeUsers.total,
      growth: '+12%'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reports.' });
  }
});

// GET /api/admin/messages
router.get('/messages', authRequired, isAdmin, async (req, res) => {
  try {
    const rows = await query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages.' });
  }
});

// GET /api/admin/newsletter
router.get('/newsletter', authRequired, isAdmin, async (req, res) => {
  try {
    const [count] = await query('SELECT COUNT(*) AS total FROM newsletter_subscribers');
    const rows = await query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 50');
    res.json({ total: count.total, subscribers: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching newsletter data.' });
  }
});

// GET /api/admin/settings
router.get('/settings', authRequired, isAdmin, async (req, res) => {
  try {
    const settings = {
      siteName: 'Global Primary Learning Hub',
      maintenanceMode: false,
      registrationOpen: true,
      emailNotifications: true,
      defaultRole: 'student'
    };
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching settings.' });
  }
});

// PUT /api/admin/settings
router.put('/settings', authRequired, isAdmin, async (req, res) => {
  try {
    const settings = req.body;
    res.json({ message: 'Settings updated successfully.', settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating settings.' });
  }
});

// ==================== MESSAGING ====================

// GET /api/messages/users (list users to message)
router.get('/messages/users', authRequired, async (req, res) => {
  try {
    const rows = await query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id != ? ORDER BY first_name, last_name',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// GET /api/messages/inbox
router.get('/messages/inbox', authRequired, async (req, res) => {
  try {
    const rows = await query(
      `SELECT m.*, u.first_name AS sender_first_name, u.last_name AS sender_last_name, u.role AS sender_role
       FROM user_messages m
       JOIN users u ON u.id = m.sender_id
       WHERE m.receiver_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching inbox.' });
  }
});

// GET /api/messages/sent
router.get('/messages/sent', authRequired, async (req, res) => {
  try {
    const rows = await query(
      `SELECT m.*, u.first_name AS receiver_first_name, u.last_name AS receiver_last_name, u.role AS receiver_role
       FROM user_messages m
       JOIN users u ON u.id = m.receiver_id
       WHERE m.sender_id = ?
       ORDER BY m.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching sent messages.' });
  }
});

// POST /api/messages/send
router.post('/messages/send', authRequired, async (req, res) => {
  try {
    const { receiverId, subject, message } = req.body;
    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver and message are required.' });
    }
    const result = await query(
      'INSERT INTO user_messages (sender_id, receiver_id, subject, message) VALUES (?, ?, ?, ?)',
      [req.user.id, receiverId, subject || '', message]
    );
    res.status(201).json({ id: result.insertId, message: 'Message sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending message.' });
  }
});

// PUT /api/messages/:id/read
router.put('/messages/:id/read', authRequired, async (req, res) => {
  try {
    const msgId = req.params.id;
    await query('UPDATE user_messages SET is_read = TRUE WHERE id = ? AND receiver_id = ?', [msgId, req.user.id]);
    res.json({ message: 'Marked as read.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating message.' });
  }
});

export default router;
