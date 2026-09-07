import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function TeacherAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.assignments().then(setAssignments).catch(() => setAssignments([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/teacher/classes"><a>📚 My Classes</a></Link>
        <Link to="/teacher/students"><a>👨‍🎓 Students</a></Link>
        <a href="#" className="active">📝 Assignments</a>
        <Link to="/teacher/grading"><a>✏️ Grading</a></Link>
        <Link to="/teacher/schedule"><a>📅 Schedule</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/teacher/resources"><a>📁 Resources</a></Link>
        <Link to="/teacher/reports"><a>📈 Reports</a></Link>
        <Link to="/teacher/upload"><a>⬆️ Upload</a></Link>
        <Link to="/teacher/library"><a>📚 Library</a></Link>
        <Link to="/teacher/live"><a>🔴 Live Teaching</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Assignments 📝</h2>
          <p style={{ color: 'var(--text-light)' }}>Manage assignments across your classes.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No assignments created yet.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {assignments.map((a) => (
              <div key={a.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px' }}>{a.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>{a.subject}</p>
                  </div>
                  <span className={`badge ${a.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem' }}>Submissions: {a.submissions}/{a.totalStudents}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
