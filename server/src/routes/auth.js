import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, username, password, role, country, grade } = req.body;
    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check existing user
    const existing = await query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email or username already in use.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (first_name, last_name, email, username, password, role, country, grade)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, username, hash, role || 'student', country || null, grade || null]
    );

    const user = {
      id: result.insertId,
      firstName,
      lastName,
      email,
      username,
      role: role || 'student',
      country,
      grade,
    };
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const rows = await query('SELECT * FROM users WHERE email = ? OR username = ?', [email, email]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        username: user.username,
        role: user.role,
        country: user.country,
        grade: user.grade,
        coins: user.coins,
        xp: user.xp,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Not authenticated.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const rows = await query('SELECT id, first_name, last_name, email, username, role, country, grade, coins, xp FROM users WHERE id = ?', [payload.id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found.' });
    const u = rows[0];
    res.json({
      id: u.id, firstName: u.first_name, lastName: u.last_name, email: u.email,
      username: u.username, role: u.role, country: u.country, grade: u.grade, coins: u.coins, xp: u.xp,
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

export default router;
