import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { liveApi } from '../../api';

export default function StudentLive() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    liveApi.list({ grade: user?.grade || '' }).then(setSessions).catch(() => setSessions([])).finally(() => setLoading(false));
  }, [user?.grade]);

  const handleJoin = async (id) => {
    try {
      const res = await liveApi.join(id);
      if (res.streamUrl) {
        window.open(res.streamUrl, '_blank');
      } else {
        alert('Joined session! (Stream URL not configured)');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a className="active">📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <Link to="/student/certificates"><a>📜 Certificates</a></Link>
        <Link to="/student/progress"><a>📈 Learning Progress</a></Link>
        <Link to="/student/achievements"><a>🏅 Achievements</a></Link>
        <Link to="/student/leaderboard"><a>🏆 Leaderboard</a></Link>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library"><a>📚 Library</a></Link>
        <Link to="/student/live" className="active"><a>🔴 Live Classes</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Live Classes 🔴</h2>
          <p style={{ color: 'var(--text-light)' }}>Join live sessions from your teachers.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading live sessions...</p>
        ) : sessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No live sessions available for your grade right now.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {sessions.map((s) => (
              <div key={s.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px' }}>{s.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>{s.description || 'No description'}</p>
                  </div>
                  <span className={`badge ${s.status === 'live' ? 'badge-error' : s.status === 'ended' ? 'badge-warning' : 'badge-primary'}`}>{s.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '.85rem', color: 'var(--text-light)', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {s.subject && <span>📚 {s.subject}</span>}
                  {s.grade && <span>🎓 {s.grade}</span>}
                  {s.scheduled_at && <span>📅 {new Date(s.scheduled_at).toLocaleString()}</span>}
                  <span>👨‍🏫 {s.first_name} {s.last_name}</span>
                </div>
                {s.status === 'live' && (
                  <button onClick={() => handleJoin(s.id)} className="btn btn-primary">▶ Join Live Class</button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
