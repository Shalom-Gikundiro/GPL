import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.reports().then(setReports).catch(() => setReports(null)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/teacher/classes"><a>📚 My Classes</a></Link>
        <Link to="/teacher/students"><a>👨‍🎓 Students</a></Link>
        <Link to="/teacher/assignments"><a>📝 Assignments</a></Link>
        <Link to="/teacher/grading"><a>✏️ Grading</a></Link>
        <Link to="/teacher/schedule"><a>📅 Schedule</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/teacher/resources"><a>📁 Resources</a></Link>
        <a href="#" className="active">📈 Reports</a>
        <Link to="/teacher/upload"><a>⬆️ Upload</a></Link>
        <Link to="/teacher/library"><a>📚 Library</a></Link>
        <Link to="/teacher/live"><a>🔴 Live Teaching</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Reports 📈</h2>
          <p style={{ color: 'var(--text-light)' }}>Teaching performance and class analytics.</p>
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
              <div className="stat-card"><div className="s-icon icon-blue">📚</div><div><h3 style={{ color: 'var(--primary)' }}>{reports.totalClasses}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Classes</p></div></div>
              <div className="stat-card"><div className="s-icon icon-green">👨‍🎓</div><div><h3 style={{ color: 'var(--secondary)' }}>{reports.totalStudents}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Students</p></div></div>
              <div className="stat-card"><div className="s-icon icon-orange">📈</div><div><h3 style={{ color: 'var(--accent)' }}>{reports.avgProgress}%</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Avg Progress</p></div></div>
              <div className="stat-card"><div className="s-icon icon-purple">✅</div><div><h3 style={{ color: 'var(--primary)' }}>{reports.completionRate}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Completion</p></div></div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '14px' }}>Monthly Performance</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['January', 'February', 'March', 'April', 'May', 'June'].map((month) => (
                  <div key={month} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ minWidth: '80px', fontSize: '.9rem' }}>{month}</span>
                    <div className="progress" style={{ flex: 1, height: '10px' }}>
                      <div className="progress-fill" style={{ width: `${Math.floor(Math.random() * 40) + 50}%` }}></div>
                    </div>
                    <span style={{ fontSize: '.85rem', color: 'var(--text-light)', minWidth: '40px' }}>{Math.floor(Math.random() * 40) + 50}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
