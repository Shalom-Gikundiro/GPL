import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api';

export default function AdminMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.messages().then(setMessages).catch(() => setMessages([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Admin Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/admin/users"><a>👥 Users</a></Link>
        <Link to="/admin/courses"><a>📚 Courses</a></Link>
        <Link to="/admin/enrollments"><a>📝 Enrollments</a></Link>
        <Link to="/admin/reports"><a>📈 Reports</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <a href="#" className="active">💬 Contact Messages</a>
        <Link to="/admin/newsletter"><a>📧 Newsletter</a></Link>
        <Link to="/admin/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Contact Messages 💬</h2>
          <p style={{ color: 'var(--text-light)' }}>Messages submitted through the contact form.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No messages yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th></tr></thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.subject || '-'}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</td>
                      <td>{new Date(m.created_at).toLocaleDateString()}</td>
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
