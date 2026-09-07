import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi } from '../../api';

export default function Attendance() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parentApi.attendance().then(setData).catch(() => setData([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Parent Menu</h3>
        <Link to="/dashboard"><a>🏠 Overview</a></Link>
        <Link to="/parent/progress"><a>📈 Progress</a></Link>
        <a href="#" className="active">📅 Attendance</a>
        <Link to="/parent/grades"><a>📊 Grades</a></Link>
        <Link to="/messages"><a>💬 Teacher Messages</a></Link>
        <Link to="/parent/events"><a>📅 Events</a></Link>
        <Link to="/parent/billing"><a>💳 Billing</a></Link>
        <Link to="/parent/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Attendance 📅</h2>
          <p style={{ color: 'var(--text-light)' }}>Track your children's attendance records.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading attendance...</p>
        ) : data.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No attendance data available.</p>
          </div>
        ) : (
          data.map((child) => (
            <div key={child.id} className="card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div className="avatar">{child.first_name[0]}{child.last_name[0]}</div>
                <div>
                  <h3 style={{ margin: 0 }}>{child.first_name} {child.last_name}</h3>
                  <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>Attendance: {child.percentage}%</p>
                </div>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Day</th><th>Status</th></tr></thead>
                  <tbody>
                    {child.days.map((d, i) => (
                      <tr key={i}>
                        <td>{d.day}</td>
                        <td><span className={`badge ${d.status === 'present' ? 'badge-success' : 'badge-warning'}`}>{d.status === 'present' ? 'Present' : 'Absent'}</span></td>
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
