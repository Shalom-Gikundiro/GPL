-- ============================================
-- Global Primary Learning Hub - Database Setup
-- ============================================
-- Run this in MySQL Workbench, phpMyAdmin, or MySQL CLI:
--   mysql -u root -p < database.sql
-- ============================================

CREATE DATABASE IF NOT EXISTS GPL;
USE GPL;

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','parent','teacher','admin') DEFAULT 'student',
  country VARCHAR(100),
  grade VARCHAR(50),
  coins INT DEFAULT 0,
  xp INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(190) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  grade VARCHAR(50) NOT NULL,
  level VARCHAR(50) DEFAULT 'Beginner',
  lessons INT DEFAULT 10,
  rating DECIMAL(2,1) DEFAULT 4.5,
  color VARCHAR(20) DEFAULT 'blue',
  icon VARCHAR(10) DEFAULT '📚'
);

-- ============================================
-- ENROLLMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  progress INT DEFAULT 0,
  completed_lessons INT DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_enroll (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ============================================
-- CONTACT MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL,
  subject VARCHAR(190),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SEED COURSES (10 courses, matching server/src/data.js)
-- ============================================
INSERT IGNORE INTO courses (id, title, subject, grade, level, lessons, rating, color, icon) VALUES
(1,  'Counting & Numbers',       'Mathematics',            'Primary 1', 'Beginner',      12, 4.8, 'blue',   '🔢'),
(2,  'Reading Adventures',        'English',                'Primary 2', 'Beginner',      15, 4.9, 'green',  '📖'),
(4,  'Multiplication Mastery',    'Mathematics',            'Primary 4', 'Intermediate',  14, 4.9, 'purple', '✖️'),
(5,  'Science Experiments',       'Science',                'Primary 5', 'Advanced',      18, 4.8, 'red',    '🔬'),
(6,  'Creative Writing',          'Writing',                'Primary 6', 'Advanced',      12, 4.6, 'cyan',   '✍️'),
(8,  'French Basics',             'French',                 'Primary 3', 'Beginner',      16, 4.7, 'green',  '🇫🇷'),
(9,  'Our Environment',           'Environmental Studies',  'Primary 2', 'Beginner',      9,  4.5, 'orange', '🌱'),
(10, 'History Heroes',            'History',                'Primary 6', 'Intermediate',  11, 4.8, 'purple', '🏛️'),
(11, 'Art & Music Fun',           'Art',                    'Kindergarten', 'Beginner',   8,  4.9, 'red',    '🎨'),
(12, 'Health & Fitness',          'Health Education',       'Primary 4', 'Beginner',      10, 4.6, 'cyan',   '💪');

-- ============================================
-- DONE
-- ============================================
-- Next steps:
-- 1. Update server/.env with your MySQL password
-- 2. Run: npm run seed
--    (This adds the demo user: demo@gpl.com / demo123)
-- 3. Run: npm run dev
-- ============================================
