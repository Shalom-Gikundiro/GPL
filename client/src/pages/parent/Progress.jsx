import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi } from '../../api';

export default function ParentProgress() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentApi.progress().then(setChildren).catch(() => setChildren([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Parent Menu</h3>
        <Link to="/dashboard"><a>🏠 Overview</a></Link>
        <a href="#" className="active">📈 Progress</a>
        <Link to="/parent/attendance"><a>📅 Attendance</a></Link>
        <Link to="/parent/grades"><a>📊 Grades</a></Link>
        <Link to="/messages"><a>💬 Teacher Messages</a></Link>
        <Link to="/parent/events"><a>📅 Events</a></Link>
        <Link to="/parent/billing"><a>💳 Billing</a></Link>
        <Link to="/parent/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Learning Progress 📈</h2>
          <p style={{ color: 'var(--text-light)' }}>Detailed progress for your children.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading progress...</p>
        ) : children.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No children linked yet.</p>
          </div>
        ) : (
          children.map((child) => (
            <div key={child.id} style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '14px' }}>{child.first_name} {child.last_name}</h3>
              <div className="grid grid-4" style={{ marginBottom: '16px' }}>
                <div className="stat-card"><div className="s-icon icon-blue">📚</div><div><h3 style={{ color: 'var(--primary)' }}>{child.enrollments?.length || 0}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Courses</p></div></div>
                <div className="stat-card"><div className="s-icon icon-green">📈</div><div><h3 style={{ color: 'var(--secondary)' }}>{child.avgProgress || 0}%</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Avg Progress</p></div></div>
                <div className="stat-card"><div className="s-icon icon-orange">✅</div><div><h3 style={{ color: 'var(--accent)' }}>{child.enrollments?.filter(e => e.progress >= 100).length || 0}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Completed</p></div></div>
                <div className="stat-card"><div className="s-icon icon-purple">⏳</div><div><h3 style={{ color: 'var(--primary)' }}>{child.enrollments?.filter(e => e.progress > 0 && e.progress < 100).length || 0}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>In Progress</p></div></div>
              </div>
              <div className="card">
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Course</th><th>Subject</th><th>Progress</th><th>Status</th></tr></thead>
                    <tbody>
                      {(child.enrollments || []).map((e, i) => (
                        <tr key={i}>
                          <td><strong>{e.title}</strong></td>
                          <td>{e.subject}</td>
                          <td>{e.progress || 0}%</td>
                          <td><span className={`badge ${e.progress >= 100 ? 'badge-success' : e.progress > 0 ? 'badge-primary' : 'badge-warning'}`}>{e.progress >= 100 ? 'Completed' : e.progress > 0 ? 'In Progress' : 'Not Started'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
