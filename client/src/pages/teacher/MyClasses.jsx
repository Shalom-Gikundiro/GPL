import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function TeacherMyClasses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacherApi.myCourses().then(setCourses).catch(() => setCourses([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <a href="#" className="active">📚 My Classes</a>
        <Link to="/teacher/students"><a>👨‍🎓 Students</a></Link>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>My Classes 📚</h2>
          <p style={{ color: 'var(--text-light)' }}>Manage and view all your assigned classes.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading classes...</p>
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>You have not been assigned to any classes yet.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {courses.map((c) => (
              <div key={c.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px' }}>{c.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>{c.subject} · {c.grade}</p>
                  </div>
                  <span className="badge badge-primary">{c.level}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '.9rem', color: 'var(--text-light)' }}>
                  <span>📚 {c.lessons} lessons</span>
                  <span>⭐ {Number(c.rating).toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
