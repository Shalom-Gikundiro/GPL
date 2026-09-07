import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function Grading() {
  const { user } = useAuth();
  const [grading, setGrading] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.grading().then(setGrading).catch(() => setGrading([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/teacher/classes"><a>📚 My Classes</a></Link>
        <Link to="/teacher/students"><a>👨‍🎓 Students</a></Link>
        <Link to="/teacher/assignments"><a>📝 Assignments</a></Link>
        <a href="#" className="active">✏️ Grading</a>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Grading ✏️</h2>
          <p style={{ color: 'var(--text-light)' }}>Review and grade student submissions.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading grading data...</p>
        ) : grading.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No submissions to grade yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Status</th></tr></thead>
                <tbody>
                  {grading.map((g, i) => (
                    <tr key={i}>
                      <td><strong>{g.student}</strong></td>
                      <td>{g.course}</td>
                      <td>{g.completed}/{g.total}</td>
                      <td>
                        <span className={`badge ${g.status === 'graded' ? 'badge-success' : 'badge-warning'}`}>
                          {g.status === 'graded' ? 'Graded' : 'Pending'}
                        </span>
                      </td>
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
