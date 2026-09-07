import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api';

export default function Assignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.assignments().then(setAssignments).catch(() => setAssignments([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a>📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <a href="#" className="active">📝 Assignments</a>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <Link to="/student/certificates"><a>📜 Certificates</a></Link>
        <Link to="/student/progress"><a>📈 Learning Progress</a></Link>
        <Link to="/student/achievements"><a>🏅 Achievements</a></Link>
        <Link to="/student/leaderboard"><a>🏆 Leaderboard</a></Link>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library"><a>📚 Library</a></Link>
        <Link to="/student/live"><a>🔴 Live Classes</a></Link>
        <Link to="/student/ai-tutor"><a>🤖 AI Study Assistant</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Assignments 📝</h2>
          <p style={{ color: 'var(--text-light)' }}>Track your pending and completed assignments.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No assignments yet. Check back later!</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Assignment</th><th>Course</th><th>Due Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id}>
                      <td><strong>{a.title}</strong></td>
                      <td>{a.course}</td>
                      <td>{new Date(a.due).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${a.status === 'graded' ? 'badge-success' : 'badge-warning'}`}>
                          {a.status === 'graded' ? `Graded (${a.grade})` : 'Pending'}
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
