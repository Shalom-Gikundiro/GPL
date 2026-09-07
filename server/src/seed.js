import dotenv from 'dotenv';
import { initSchema, query } from './db.js';
import { courses, subjects, grades } from './data.js';

dotenv.config();

async function seed() {
  try {
    await initSchema();
    console.log('Schema ready. Seeding data...');

    const bcrypt = (await import('bcryptjs')).default;

    // Seed courses
    const courseCount = await query('SELECT COUNT(*) AS c FROM courses');
    if (courseCount[0].c === 0) {
      for (const c of courses) {
        await query(
          'INSERT INTO courses (title, subject, grade, level, lessons, rating, color, icon) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [c.title, c.subject, c.grade, c.level, c.lessons, c.rating, c.color, c.icon]
        );
      }
      console.log(`✅ Seeded ${courses.length} courses`);
    }

    // Seed demo users for each role
    const demoUsers = [
      { firstName: 'Amara', lastName: 'Student', email: 'demo@gpl.com', username: 'amara', password: 'demo123', role: 'student', country: 'Rwanda', grade: 'Primary 4', coins: 340, xp: 1250 },
      { firstName: 'Jean', lastName: 'Parent', email: 'parent@gpl.com', username: 'jean', password: 'demo123', role: 'parent', country: 'Rwanda', grade: null, coins: 0, xp: 0 },
      { firstName: 'Teacher', lastName: 'Gikundi', email: 'teacher@gpl.com', username: 'gikundi', password: 'demo123', role: 'teacher', country: 'Rwanda', grade: null, coins: 0, xp: 0 },
      { firstName: 'Admin', lastName: 'User', email: 'admin@gpl.com', username: 'admin', password: 'demo123', role: 'admin', country: 'Rwanda', grade: null, coins: 0, xp: 0 },
    ];

    const userIds = {};
    for (const u of demoUsers) {
      const existing = await query('SELECT id FROM users WHERE email = ?', [u.email]);
      if (existing.length === 0) {
        const hash = await bcrypt.hash(u.password, 10);
        const result = await query(
          `INSERT INTO users (first_name, last_name, email, username, password, role, country, grade, coins, xp)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [u.firstName, u.lastName, u.email, u.username, hash, u.role, u.country, u.grade, u.coins, u.xp]
        );
        userIds[u.role] = result.insertId;
        console.log(`✅ Seeded ${u.role}: ${u.email} / ${u.password}`);
      } else {
        userIds[u.role] = existing[0].id;
        console.log(`ℹ️  ${u.role} already exists: ${u.email}`);
      }
    }

    // Assign teacher to first 5 courses
    const teacherId = userIds.teacher;
    if (teacherId) {
      const assigned = await query('SELECT COUNT(*) AS c FROM courses WHERE teacher_id = ?', [teacherId]);
      if (assigned[0].c === 0) {
        await query('UPDATE courses SET teacher_id = ? WHERE id IN (1,2,4,5,6)', [teacherId]);
        console.log('✅ Assigned teacher to 5 courses');
      }
    }

    // Link parent to student
    const parentId = userIds.parent;
    const studentId = userIds.student;
    if (parentId && studentId) {
      const linked = await query('SELECT COUNT(*) AS c FROM parent_children WHERE parent_id = ? AND child_id = ?', [parentId, studentId]);
      if (linked[0].c === 0) {
        await query('INSERT INTO parent_children (parent_id, child_id) VALUES (?, ?)', [parentId, studentId]);
        console.log('✅ Linked parent to student');
      }
    }

    // Seed enrollments for student
    if (studentId) {
      const enrolled = await query('SELECT COUNT(*) AS c FROM enrollments WHERE user_id = ?', [studentId]);
      if (enrolled[0].c === 0) {
        await query('INSERT IGNORE INTO enrollments (user_id, course_id, progress, completed_lessons) VALUES (?, ?, ?, ?)', [studentId, 1, 45, 5]);
        await query('INSERT IGNORE INTO enrollments (user_id, course_id, progress, completed_lessons) VALUES (?, ?, ?, ?)', [studentId, 2, 80, 12]);
        await query('INSERT IGNORE INTO enrollments (user_id, course_id, progress, completed_lessons) VALUES (?, ?, ?, ?)', [studentId, 4, 20, 3]);
        console.log('✅ Seeded student enrollments');
      }
    }

    console.log('Subjects available:', subjects.length);
    console.log('Grades available:', grades.length);
    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
