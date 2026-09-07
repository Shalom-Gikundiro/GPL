import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api';

export default function RecentLessons() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.lessons().then(setLessons).catch(() => setLessons([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a>📚 My Courses</a></Link>
        <a href="#" className="active">🕒 Recent Lessons</a>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <Link to="/student/certificates"><a>📜 Certificates</a></Link>
        <Link to="/student/progress"><a>📈 Learning Progress</a></Link>
        <Link to="/student/achievements"><a>🏅 Achievements</a></Link>
        <Link to="/student/leaderboard"><a>🏆 Leaderboard</a></Link>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library"><a>📚 Library</a></Link>
        <Link to="/student/live"><a>🔴 Live Classes</a></Link>
        <Link to="/student/ai-tutor"><a>🤖 AI Study Assistant</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Recent Lessons 🕒</h2>
          <p style={{ color: 'var(--text-light)' }}>Continue learning where you left off.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '16px' }}>You haven't started any lessons yet. Enroll in a course to begin!</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid grid-2" style={{ marginBottom: '24px' }}>
            {lessons.map((lesson) => (
              <div key={lesson.id} className={`card ${lesson.locked ? 'reveal' : ''}`} style={{ opacity: lesson.locked ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-primary">{lesson.course}</span>
                  <span style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Lesson {lesson.number}/{lesson.total}</span>
                </div>
                <h3 style={{ margin: '10px 0' }}>{lesson.subject} - Lesson {lesson.number}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>
                  {lesson.completed ? '✅ Completed' : lesson.locked ? '🔒 Locked' : '▶ Start Learning'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
