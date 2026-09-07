import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

// GET /api/plans (pricing)
router.get('/plans', (req, res) => {
  const plans = [
    { id: 1, name: 'Monthly', price: 5, period: 'month', features: ['Full access to all subjects','AI Study Assistant','Games & quizzes','Downloadable worksheets'] },
    { id: 2, name: 'Quarterly', price: 12, period: 'quarter', features: ['Everything in Monthly','Live classes included','Parent progress reports','Priority support'] },
    { id: 3, name: 'Yearly', price: 40, period: 'year', popular: true, features: ['Everything in Quarterly','Verified certificates','2 teacher accounts','Offline learning','50% off (limited time)'] },
    { id: 4, name: 'Lifetime', price: 99, period: 'once', features: ['Everything in Yearly','Unlimited forever','All future content','5 family accounts','Lifetime support'] }
  ];
  res.json(plans);
});

// POST /api/chat - simple AI assistant stub
router.post('/chat', (req, res) => {
  const { message = '' } = req.body;
  const q = message.toLowerCase();
  let reply;
  if (q.includes('hello') || q.includes('hi')) {
    reply = 'Hello! 👋 Welcome to Global Primary Learning Hub. How can I help you learn today?';
  } else if (q.includes('math')) {
    reply = 'We have complete math lessons for all grades! Visit the Courses page to get started. 📐';
  } else if (q.includes('course') || q.includes('learn')) {
    reply = 'We offer 30+ subjects across all primary grades. Explore our Courses page! 🎓';
  } else if (q.includes('price') || q.includes('cost') || q.includes('pay')) {
    reply = 'We offer flexible plans - Monthly, Quarterly, Yearly, and Lifetime! Check our Pricing page. 💳';
  } else if (q.includes('certificate')) {
    reply = 'You earn a verified certificate with QR code after completing each course! 📜';
  } else {
    reply = 'Great question! Ask about math, courses, pricing, or certificates.';
  }
  res.json({ reply });
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }
    await query(
      'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject || '', message]
    );
    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending message.' });
  }
});

// POST /api/newsletter
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    await query('INSERT IGNORE INTO newsletter_subscribers (email) VALUES (?)', [email]);
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error subscribing.' });
  }
});

export default router;
