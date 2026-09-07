import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi } from '../../api';

export default function ParentGrades() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentApi.grades().then(setData).catch(() => setData([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Parent Menu</h3>
        <Link to="/dashboard"><a>🏠 Overview</a></Link>
        <Link to="/parent/progress"><a>📈 Progress</a></Link>
        <Link to="/parent/attendance"><a>📅 Attendance</a></Link>
        <a href="#" className="active">📊 Grades</a>
        <Link to="/messages"><a>💬 Teacher Messages</a></Link>
        <Link to="/parent/events"><a>📅 Events</a></Link>
        <Link to="/parent/billing"><a>💳 Billing</a></Link>
        <Link to="/parent/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Grades 📊</h2>
          <p style={{ color: 'var(--text-light)' }}>View your children's academic performance.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading grades...</p>
        ) : data.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No grades available yet.</p>
          </div>
        ) : (
          data.map((child) => (
            <div key={child.id} className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="avatar">{child.first_name[0]}{child.last_name[0]}</div>
                <h3 style={{ margin: 0 }}>{child.first_name} {child.last_name}</h3>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Subject</th><th>Score</th><th>Grade</th></tr></thead>
                  <tbody>
                    {(child.grades || []).map((g, i) => (
                      <tr key={i}>
                        <td>{g.subject}</td>
                        <td>{g.score}%</td>
                        <td><span className={`badge ${g.score >= 80 ? 'badge-success' : g.score >= 50 ? 'badge-primary' : 'badge-warning'}`}>{g.grade}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
