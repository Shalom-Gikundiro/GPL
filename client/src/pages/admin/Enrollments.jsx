import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api';

export default function AdminEnrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.enrollments().then(setEnrollments).catch(() => setEnrollments([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Admin Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/admin/users"><a>👥 Users</a></Link>
        <Link to="/admin/courses"><a>📚 Courses</a></Link>
        <a href="#" className="active">📝 Enrollments</a>
        <Link to="/admin/reports"><a>📈 Reports</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/admin/newsletter"><a>📧 Newsletter</a></Link>
        <Link to="/admin/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Enrollments 📝</h2>
          <p style={{ color: 'var(--text-light)' }}>All course enrollments on the platform.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading enrollments...</p>
        ) : enrollments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No enrollments yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>ID</th><th>Student</th><th>Course</th><th>Progress</th><th>Completed</th><th>Enrolled Date</th></tr></thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.first_name} {e.last_name}</td>
                      <td><strong>{e.title}</strong></td>
                      <td>{e.progress}%</td>
                      <td>{e.completed_lessons}/{e.lessons}</td>
                      <td>{new Date(e.enrolled_at).toLocaleDateString()}</td>
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
