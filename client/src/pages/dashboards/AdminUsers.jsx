import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.users()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Admin Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <a href="#" className="active">👥 Users</a>
        <Link to="/admin/courses"><a>📚 Courses</a></Link>
        <Link to="/admin/enrollments"><a>📝 Enrollments</a></Link>
        <Link to="/admin/reports"><a>📈 Reports</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/admin/newsletter"><a>📧 Newsletter</a></Link>
        <Link to="/admin/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>User Management 👥</h2>
          <p style={{ color: 'var(--text-light)' }}>View and manage all registered users on the platform.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading users...</p>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Email</th><th>Username</th><th>Role</th><th>Country</th><th>Grade</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.first_name} {u.last_name}</td>
                      <td>{u.email}</td>
                      <td>{u.username}</td>
                      <td><span className={`badge ${u.role === 'admin' ? 'badge-error' : u.role === 'teacher' ? 'badge-warning' : u.role === 'parent' ? 'badge-primary' : 'badge-success'}`}>{u.role}</span></td>
                      <td>{u.country || '-'}</td>
                      <td>{u.grade || '-'}</td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
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
