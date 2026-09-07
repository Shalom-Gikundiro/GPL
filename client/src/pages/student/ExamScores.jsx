import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api';

export default function ExamScores() {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.exams().then(setExams).catch(() => setExams([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a>📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <a href="#" className="active">📊 Exam Scores</a>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Exam Scores 📊</h2>
          <p style={{ color: 'var(--text-light)' }}>View your latest exam results.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading exam scores...</p>
        ) : exams.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No exam scores yet. Complete assessments to see your results here.</p>
          </div>
        ) : (
          <div className="grid grid-2" style={{ marginBottom: '24px' }}>
            {exams.map((exam) => (
              <div key={exam.id} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
                <h3 style={{ margin: '0 0 8px' }}>{exam.subject}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>{exam.score}%</div>
                <span className={`badge ${exam.score >= 80 ? 'badge-success' : exam.score >= 50 ? 'badge-primary' : 'badge-warning'}`}>
                  {exam.grade}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
