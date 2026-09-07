import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api';

export default function Newsletter() {
  const { user } = useAuth();
  const [data, setData] = useState({ total: 0, subscribers: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.newsletter().then(setData).catch(() => setData({ total: 0, subscribers: [] })).finally(() => setLoading(false));
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
        <a href="#" className="active">📧 Newsletter</a>
        <Link to="/admin/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Newsletter 📧</h2>
          <p style={{ color: 'var(--text-light)' }}>Manage newsletter subscribers.</p>
        </div>

        <div className="grid grid-3" style={{ marginBottom: '24px' }}>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📧</div>
            <h3 style={{ color: 'var(--primary)' }}>{data.total}</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Total Subscribers</p>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
            <h3 style={{ color: 'var(--secondary)' }}>+24</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>This Week</p>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌍</div>
            <h3 style={{ color: 'var(--accent)' }}>12</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Countries</p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading subscribers...</p>
        ) : data.subscribers.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No subscribers yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Email</th><th>Subscribed Date</th></tr></thead>
                <tbody>
                  {data.subscribers.map((s) => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.email}</td>
                      <td>{new Date(s.created_at).toLocaleDateString()}</td>
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
