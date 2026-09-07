import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function TeacherStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.students().then(setStudents).catch(() => setStudents([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/teacher/classes"><a>📚 My Classes</a></Link>
        <a href="#" className="active">👨‍🎓 Students</a>
        <Link to="/teacher/assignments"><a>📝 Assignments</a></Link>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Students 👨‍🎓</h2>
          <p style={{ color: 'var(--text-light)' }}>All students enrolled in your classes.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading students...</p>
        ) : students.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No students enrolled in your classes yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Grade</th><th>Course</th><th>Progress</th><th>Status</th></tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i}>
                      <td><strong>{s.first_name} {s.last_name}</strong></td>
                      <td>{s.email}</td>
                      <td>{s.grade || '-'}</td>
                      <td>{s.course_title}</td>
                      <td>{s.progress || 0}%</td>
                      <td><span className={`badge ${(s.progress || 0) >= 80 ? 'badge-success' : (s.progress || 0) >= 50 ? 'badge-primary' : 'badge-warning'}`}>{(s.progress || 0) >= 80 ? 'Excellent' : (s.progress || 0) >= 50 ? 'Good' : 'Fair'}</span></td>
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
