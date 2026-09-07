import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api';

export default function AdminReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.reports().then(setReports).catch(() => setReports(null)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Admin Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/admin/users"><a>👥 Users</a></Link>
        <Link to="/admin/courses"><a>📚 Courses</a></Link>
        <Link to="/admin/enrollments"><a>📝 Enrollments</a></Link>
        <a href="#" className="active">📈 Reports</a>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/admin/newsletter"><a>📧 Newsletter</a></Link>
        <Link to="/admin/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Reports 📈</h2>
          <p style={{ color: 'var(--text-light)' }}>Platform analytics and insights.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading reports...</p>
        ) : !reports ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>Unable to load reports.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-4" style={{ marginBottom: '24px' }}>
              <div className="stat-card"><div className="s-icon icon-blue">👥</div><div><h3 style={{ color: 'var(--primary)' }}>{reports.totalUsers}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Total Users</p></div></div>
              <div className="stat-card"><div className="s-icon icon-green">📚</div><div><h3 style={{ color: 'var(--secondary)' }}>{reports.totalCourses}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Courses</p></div></div>
              <div className="stat-card"><div className="s-icon icon-orange">📝</div><div><h3 style={{ color: 'var(--accent)' }}>{reports.totalEnrollments}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Enrollments</p></div></div>
              <div className="stat-card"><div className="s-icon icon-purple">📈</div><div><h3 style={{ color: 'var(--primary)' }}>{reports.activeUsers}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Active Users</p></div></div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '14px' }}>Growth Trend</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => (
                  <div key={month} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ minWidth: '40px', fontSize: '.9rem' }}>{month}</span>
                    <div className="progress" style={{ flex: 1, height: '10px' }}>
                      <div className="progress-fill" style={{ width: `${Math.floor(Math.random() * 40) + 40}%` }}></div>
                    </div>
                    <span style={{ fontSize: '.85rem', color: 'var(--text-light)', minWidth: '40px' }}>{Math.floor(Math.random() * 40) + 40}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '14px' }}>Platform Health</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'var(--gray)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📈</div>
                  <h4 style={{ margin: '0 0 4px' }}>User Growth</h4>
                  <p style={{ color: 'var(--secondary)', fontWeight: 700, margin: 0 }}>+{reports.growth} this month</p>
                </div>
                <div style={{ padding: '16px', background: 'var(--gray)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>✅</div>
                  <h4 style={{ margin: '0 0 4px' }}>Completion Rate</h4>
                  <p style={{ color: 'var(--secondary)', fontWeight: 700, margin: 0 }}>78% average</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
