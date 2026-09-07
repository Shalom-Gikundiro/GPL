import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi } from '../../api';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentApi.events().then(setEvents).catch(() => setEvents([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Parent Menu</h3>
        <Link to="/dashboard"><a>🏠 Overview</a></Link>
        <Link to="/parent/progress"><a>📈 Progress</a></Link>
        <Link to="/parent/attendance"><a>📅 Attendance</a></Link>
        <Link to="/parent/grades"><a>📊 Grades</a></Link>
        <Link to="/messages"><a>💬 Teacher Messages</a></Link>
        <a href="#" className="active">📅 Events</a>
        <Link to="/parent/billing"><a>💳 Billing</a></Link>
        <Link to="/parent/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Upcoming Events 📅</h2>
          <p style={{ color: 'var(--text-light)' }}>School events, meetings, and activities.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading events...</p>
        ) : events.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No upcoming events.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {events.map((e) => (
              <div key={e.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    padding: '12px',
                    borderRadius: '10px',
                    textAlign: 'center',
                    minWidth: '60px'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{new Date(e.date).getDate()}</div>
                    <div style={{ fontSize: '.75rem', textTransform: 'uppercase' }}>{new Date(e.date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px' }}>{e.title}</h4>
                    <small style={{ color: 'var(--text-light)' }}>{e.time}</small>
                  </div>
                </div>
                <span className={`badge ${e.type === 'meeting' ? 'badge-primary' : 'badge-warning'}`}>{e.type === 'meeting' ? 'Meeting' : 'Event'}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
