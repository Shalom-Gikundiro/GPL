import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi } from '../../api';

export default function TeacherMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentApi.messages().then(setMessages).catch(() => setMessages([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Parent Menu</h3>
        <Link to="/dashboard"><a>🏠 Overview</a></Link>
        <Link to="/parent/progress"><a>📈 Progress</a></Link>
        <Link to="/parent/attendance"><a>📅 Attendance</a></Link>
        <Link to="/parent/grades"><a>📊 Grades</a></Link>
        <a href="#" className="active">💬 Teacher Messages</a>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/parent/events"><a>📅 Events</a></Link>
        <Link to="/parent/billing"><a>💳 Billing</a></Link>
        <Link to="/parent/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Teacher Messages 💬</h2>
          <p style={{ color: 'var(--text-light)' }}>Communication from your child's teachers.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No messages yet. Teachers will send updates here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m) => (
              <div key={m.id} className="card" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '16px' }}>
                <div className="avatar">{m.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong>{m.from}</strong>
                    <small style={{ color: 'var(--text-light)' }}>{m.time}</small>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
