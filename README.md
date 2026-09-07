# 🎓 Global Primary Learning Hub

A full-stack educational platform built with **React** (frontend) and **Node.js + Express + MySQL** (backend).

## 📁 Project Structure
```
GPL/
├── server/            # Express backend + MySQL
│   ├── src/
│   │   ├── server.js         # Entry point
│   │   ├── db.js             # MySQL connection pool + schema
│   │   ├── seed.js           # Seed script (courses + demo user)
│   │   ├── data.js           # Seed data
│   │   ├── middleware/auth.js
│   │   └── routes/           # auth, courses, misc routes
│   ├── .env.example
│   └── package.json
└── client/            # React + Vite frontend
    ├── src/
    │   ├── components/       # Navbar, Footer, ChatWidget, CourseCard
    │   ├── contexts/         # AuthContext, ThemeContext
    │   ├── pages/            # Home, Courses, Subjects, About, Register, Login, Dashboard, Pricing
    │   └── App.jsx
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL running locally

### 1. Set up the database
Create a MySQL database:
```sql
CREATE DATABASE GPL;
```

### 2. Configure backend environment
```bash
cd server
cp .env.example .env
# Edit .env and set your MySQL credentials + JWT_SECRET
```

### 3. Install backend dependencies & seed data
```bash
cd server
npm install
npm run seed        # Seeds courses + demo user (demo@gpl.com / demo123)
```

### 4. Start the backend
```bash
cd server
npm run dev         # Runs on http://localhost:5000
```

### 5. Install & start the frontend
```bash
cd client
npm install
npm run dev         # Runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## 🔑 Demo Login
- **Email:** `demo@gpl.com`
- **Password:** `demo123`

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/courses` | List courses (search/filter) |
| GET | `/api/courses/subjects` | List subjects |
| GET | `/api/courses/grades` | List grades |
| GET | `/api/courses/mine/enrolled` | User's enrolled courses |
| POST | `/api/courses/:id/enroll` | Enroll in a course |
| GET | `/api/plans` | Pricing plans |
| POST | `/api/chat` | AI assistant |
| POST | `/api/contact` | Contact form |
| POST | `/api/newsletter` | Newsletter subscribe |

## 🛠 Tech Stack
- **Frontend:** React 18, React Router, Vite
- **Backend:** Node.js, Express
- **Database:** MySQL (mysql2)
- **Auth:** JWT + bcrypt
