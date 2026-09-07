import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function Schedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.schedule().then(setSchedule).catch(() => setSchedule([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/teacher/classes"><a>📚 My Classes</a></Link>
        <Link to="/teacher/students"><a>👨‍🎓 Students</a></Link>
        <Link to="/teacher/assignments"><a>📝 Assignments</a></Link>
        <Link to="/teacher/grading"><a>✏️ Grading</a></Link>
        <a href="#" className="active">📅 Schedule</a>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/teacher/resources"><a>📁 Resources</a></Link>
        <Link to="/teacher/reports"><a>📈 Reports</a></Link>
        <Link to="/teacher/upload"><a>⬆️ Upload</a></Link>
        <Link to="/teacher/library"><a>📚 Library</a></Link>
        <Link to="/teacher/live"><a>🔴 Live Teaching</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Schedule 📅</h2>
          <p style={{ color: 'var(--text-light)' }}>Your teaching schedule for today.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading schedule...</p>
        ) : schedule.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No classes scheduled. Assign yourself to courses to see your schedule.</p>
          </div>
        ) : (
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {schedule.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'var(--gray)', borderRadius: '10px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', minWidth: '60px', fontSize: '1.1rem' }}>{item.time}</div>
                  <div style={{ flex: 1 }}>
                    <strong>{item.title}</strong> - {item.grade}<br />
                    <small style={{ color: 'var(--text-light)' }}>{item.subject} · {item.level} · {item.duration}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
