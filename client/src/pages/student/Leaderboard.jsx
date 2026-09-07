import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.leaderboard().then(setLeaders).catch(() => setLeaders([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a>📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <Link to="/student/certificates"><a>📜 Certificates</a></Link>
        <Link to="/student/progress"><a>📈 Learning Progress</a></Link>
        <Link to="/student/achievements"><a>🏅 Achievements</a></Link>
        <a href="#" className="active">🏆 Leaderboard</a>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library"><a>📚 Library</a></Link>
        <Link to="/student/live"><a>🔴 Live Classes</a></Link>
        <Link to="/student/ai-tutor"><a>🤖 AI Study Assistant</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Leaderboard 🏆</h2>
          <p style={{ color: 'var(--text-light)' }}>See how you rank among other learners.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading leaderboard...</p>
        ) : leaders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No rankings yet. Be the first to earn XP!</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Rank</th><th>Student</th><th>XP</th><th>Coins</th><th>Courses</th></tr>
                </thead>
                <tbody>
                  {leaders.map((s, i) => (
                    <tr key={i} style={s.first_name === user?.firstName && s.last_name === user?.lastName ? { background: 'var(--primary-light)' } : {}}>
                      <td>
                        <span style={{
                          fontWeight: 800,
                          color: i === 0 ? 'var(--accent)' : i === 1 ? '#94A3B8' : i === 2 ? '#B45309' : 'var(--text)'
                        }}>
                          #{i + 1}
                        </span>
                      </td>
                      <td><strong>{s.first_name} {s.last_name}</strong></td>
                      <td>⭐ {s.xp}</td>
                      <td>🪙 {s.coins}</td>
                      <td>📚 {s.courses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
