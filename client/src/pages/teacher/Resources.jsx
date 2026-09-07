import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.resources().then(setResources).catch(() => setResources([])).finally(() => setLoading(false));
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
        <a href="#" className="active">📁 Resources</a>
        <Link to="/teacher/reports"><a>📈 Reports</a></Link>
        <Link to="/teacher/upload"><a>⬆️ Upload</a></Link>
        <Link to="/teacher/library"><a>📚 Library</a></Link>
        <Link to="/teacher/live"><a>🔴 Live Teaching</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Resources 📁</h2>
          <p style={{ color: 'var(--text-light)' }}>Teaching materials and resources.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading resources...</p>
        ) : resources.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No resources uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {resources.map((r) => (
              <div key={r.id} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📄</div>
                <h4 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{r.title}</h4>
                <p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>{r.type.toUpperCase()} · {r.size}</p>
                <button className="btn btn-outline" style={{ marginTop: '12px', padding: '8px 16px', fontSize: '.85rem' }}>Download</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
