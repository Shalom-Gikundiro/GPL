import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { teacherApi } from '../../api';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ classes: 0, students: 0, pendingSubmissions: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      teacherApi.myCourses(),
      teacherApi.students(),
      teacherApi.stats()
    ])
      .then(([courses, studentsData, statsData]) => {
        setMyCourses(courses);
        setStudents(studentsData);
        const avgRating = courses.length > 0
          ? Math.round((courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length) * 10) / 10
          : 0;
        setStats({ ...statsData, avgRating });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a className="active">📊 Dashboard</a></Link>
        <Link to="/teacher/classes"><a>📚 My Classes</a></Link>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Welcome, Teacher {user?.lastName}! 👩‍🏫</h2>
          <p style={{ color: 'var(--text-light)' }}>Manage your classes, track student progress, and create engaging lessons.</p>
        </div>

        <div className="grid grid-4" style={{ marginBottom: '24px' }}>
          <div className="stat-card"><div className="s-icon icon-blue">📚</div><div><h3 style={{ color: 'var(--primary)' }}>{stats.classes}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>My Classes</p></div></div>
          <div className="stat-card"><div className="s-icon icon-green">👨‍🎓</div><div><h3 style={{ color: 'var(--secondary)' }}>{stats.students}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Students</p></div></div>
          <div className="stat-card"><div className="s-icon icon-orange">✏️</div><div><h3 style={{ color: 'var(--accent)' }}>{stats.pendingSubmissions}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Pending Grading</p></div></div>
          <div className="stat-card"><div className="s-icon icon-purple">⭐</div><div><h3 style={{ color: 'var(--primary)' }}>{stats.avgRating || '0'}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Avg Rating</p></div></div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: '24px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '14px' }}>📚 My Classes</h3>
            {loading ? (
              <p style={{ color: 'var(--text-light)' }}>Loading classes...</p>
            ) : myCourses.length === 0 ? (
              <p style={{ color: 'var(--text-light)' }}>You have not been assigned to any classes yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myCourses.map((c) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--gray)', borderRadius: '8px' }}>
                    <div>
                      <strong>{c.title}</strong><br />
                      <small style={{ color: 'var(--text-light)' }}>{c.subject} · {c.grade}</small>
                    </div>
                    <span className="badge badge-primary">{c.level}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '14px' }}>📝 Recent Submissions</h3>
            {loading ? (
              <p style={{ color: 'var(--text-light)' }}>Loading submissions...</p>
            ) : students.length === 0 ? (
              <p style={{ color: 'var(--text-light)' }}>No submissions yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {students.slice(0, 5).map((s, i) => {
                  const course = myCourses.find(c => c.title === s.course_title);
                  const totalLessons = course ? course.lessons : 0;
                  const completed = s.completed_lessons || 0;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--gray)', borderRadius: '8px' }}>
                      <div>
                        <strong>{s.first_name} {s.last_name}</strong><br />
                        <small style={{ color: 'var(--text-light)' }}>{s.course_title} · {completed}/{totalLessons} lessons</small>
                      </div>
                      <span className={`badge ${completed >= totalLessons ? 'badge-success' : 'badge-warning'}`}>
                        {completed >= totalLessons ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '14px' }}>📊 Class Performance</h3>
          {loading ? (
            <p style={{ color: 'var(--text-light)' }}>Loading performance data...</p>
          ) : students.length === 0 ? (
            <p style={{ color: 'var(--text-light)' }}>No student data available yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student</th><th>Course</th><th>Progress</th><th>Completed</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {students.map((s, i) => {
                    const course = myCourses.find(c => c.title === s.course_title);
                    const progress = s.progress || 0;
                    const completed = s.completed_lessons || 0;
                    const total = course ? course.lessons : 0;
                    return (
                      <tr key={i}>
                        <td>{s.first_name} {s.last_name}</td>
                        <td>{s.course_title}</td>
                        <td>{progress}%</td>
                        <td>{completed}/{total}</td>
                        <td>
                          <span className={`badge ${progress >= 80 ? 'badge-success' : progress >= 50 ? 'badge-primary' : 'badge-warning'}`}>
                            {progress >= 80 ? 'Excellent' : progress >= 50 ? 'Good' : 'Fair'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '14px' }}>📅 Today's Schedule</h3>
          {myCourses.length === 0 ? (
            <p style={{ color: 'var(--text-light)' }}>No classes scheduled. Assign yourself to courses to see your schedule here.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myCourses.map((c, i) => (
                <div key={c.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '14px', background: 'var(--gray)', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', minWidth: '60px' }}>
                    {8 + i}:00
                  </div>
                  <div>
                    <strong>{c.title}</strong> - {c.grade}<br />
                    <small style={{ color: 'var(--text-light)' }}>{c.subject} · {c.level} · {c.lessons} lessons</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
