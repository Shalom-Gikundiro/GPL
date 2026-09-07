import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.stats(),
      adminApi.users()
    ])
      .then(([s, u]) => { setStats(s); setUsers(u); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Admin Menu</h3>
        <Link to="/dashboard"><a className="active">📊 Dashboard</a></Link>
        <Link to="/admin/users"><a>👥 Users</a></Link>
        <Link to="/admin/courses"><a>📚 Courses</a></Link>
        <Link to="/admin/enrollments"><a>📝 Enrollments</a></Link>
        <Link to="/admin/reports"><a>📈 Reports</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/admin/newsletter"><a>📧 Newsletter</a></Link>
        <Link to="/admin/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Admin Dashboard 🏫</h2>
          <p style={{ color: 'var(--text-light)' }}>Manage users, courses, and monitor platform performance.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading admin data...</p>
        ) : stats ? (
          <>
            <div className="grid grid-4" style={{ marginBottom: '24px' }}>
              <div className="stat-card"><div className="s-icon icon-blue">👥</div><div><h3 style={{ color: 'var(--primary)' }}>{stats.totals.users}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Total Users</p></div></div>
              <div className="stat-card"><div className="s-icon icon-green">📚</div><div><h3 style={{ color: 'var(--secondary)' }}>{stats.totals.courses}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Courses</p></div></div>
              <div className="stat-card"><div className="s-icon icon-orange">📝</div><div><h3 style={{ color: 'var(--accent)' }}>{stats.totals.enrollments}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Enrollments</p></div></div>
              <div className="stat-card"><div className="s-icon icon-purple">💬</div><div><h3 style={{ color: 'var(--primary)' }}>{stats.totals.messages}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Messages</p></div></div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '24px' }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0 }}>👥 Recent Users</h3>
                  <Link to="/admin/users" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '.8rem' }}>View All</Link>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                    <tbody>
                      {stats.recentUsers && stats.recentUsers.length > 0 ? stats.recentUsers.map((u) => (
                        <tr key={u.id}><td>{u.first_name} {u.last_name}</td><td>{u.email}</td><td><span className="badge badge-primary">{u.role}</span></td></tr>
                      )) : <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-light)' }}>No users yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0 }}>📝 Recent Enrollments</h3>
                  <Link to="/admin/enrollments" className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '.8rem' }}>View All</Link>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Student</th><th>Course</th><th>Date</th></tr></thead>
                    <tbody>
                      {stats.recentEnrollments && stats.recentEnrollments.length > 0 ? stats.recentEnrollments.map((e) => (
                        <tr key={e.id}><td>{e.first_name} {e.last_name}</td><td>{e.title}</td><td>{new Date(e.enrolled_at).toLocaleDateString()}</td></tr>
                      )) : <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-light)' }}>No enrollments yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📧</div>
                <h3 style={{ color: 'var(--primary)' }}>{stats.totals.newsletter}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Newsletter Subscribers</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💬</div>
                <h3 style={{ color: 'var(--secondary)' }}>{stats.totals.messages}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Contact Messages</p>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🌍</div>
                <h3 style={{ color: 'var(--accent)' }}>Global</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Worldwide Reach</p>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '14px' }}>⚡ Quick Actions</h3>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/courses" className="btn btn-primary">Manage Courses</Link>
                <button className="btn btn-outline">Send Newsletter</button>
                <button className="btn btn-outline">Export Reports</button>
                <button className="btn btn-outline">System Settings</button>
              </div>
            </div>
          </>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>Unable to load admin data. Please try again later.</p>
          </div>
        )}
      </main>
    </div>
  );
}
