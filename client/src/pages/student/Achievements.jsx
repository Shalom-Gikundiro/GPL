import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api';

export default function Achievements() {
  const { user } = useAuth();
  const [data, setData] = useState({ badges: 0, coins: 0, xp: 0, achievements: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.achievements().then(setData).catch(() => setData({ badges: 0, coins: 0, xp: 0, achievements: [] })).finally(() => setLoading(false));
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
        <a href="#" className="active">🏅 Achievements</a>
        <Link to="/student/leaderboard"><a>🏆 Leaderboard</a></Link>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library"><a>📚 Library</a></Link>
        <Link to="/student/live"><a>🔴 Live Classes</a></Link>
        <Link to="/student/ai-tutor"><a>🤖 AI Study Assistant</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Achievements 🏅</h2>
          <p style={{ color: 'var(--text-light)' }}>Your badges, coins, and XP.</p>
        </div>

        <div className="grid grid-3" style={{ marginBottom: '24px' }}>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏅</div>
            <h3 style={{ color: 'var(--primary)' }}>{data.badges}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Badges Earned</p>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🪙</div>
            <h3 style={{ color: 'var(--secondary)' }}>{data.coins}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Coins</p>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⭐</div>
            <h3 style={{ color: 'var(--accent)' }}>{data.xp}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>XP Points</p>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '14px' }}>Badge Collection</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {data.achievements.map((a) => (
              <div key={a.id} style={{
                flex: '1 1 200px',
                padding: '16px',
                background: a.unlocked ? 'var(--gray)' : 'var(--bg)',
                border: `2px solid ${a.unlocked ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '12px',
                textAlign: 'center',
                opacity: a.unlocked ? 1 : 0.5
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{a.unlocked ? '🏆' : '🔒'}</div>
                <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{a.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.85rem' }}>{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
