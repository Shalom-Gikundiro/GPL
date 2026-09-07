import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api';

export default function LearningProgress() {
  const { user } = useAuth();
  const [data, setData] = useState({ courses: [], avgProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.progress().then(setData).catch(() => setData({ courses: [], avgProgress: 0 })).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a>📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <Link to="/student/certificates"><a>📜 Certificates</a></Link>
        <a href="#" className="active">📈 Learning Progress</a>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Learning Progress 📈</h2>
          <p style={{ color: 'var(--text-light)' }}>Detailed breakdown of your learning journey.</p>
        </div>

        <div className="grid grid-4" style={{ marginBottom: '24px' }}>
          <div className="stat-card"><div className="s-icon icon-blue">📚</div><div><h3 style={{ color: 'var(--primary)' }}>{data.courses.length}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Enrolled</p></div></div>
          <div className="stat-card"><div className="s-icon icon-green">✅</div><div><h3 style={{ color: 'var(--secondary)' }}>{data.courses.filter(c => c.progress >= 100).length}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Completed</p></div></div>
          <div className="stat-card"><div className="s-icon icon-orange">⏳</div><div><h3 style={{ color: 'var(--accent)' }}>{data.courses.filter(c => c.progress > 0 && c.progress < 100).length}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>In Progress</p></div></div>
          <div className="stat-card"><div className="s-icon icon-purple">📈</div><div><h3 style={{ color: 'var(--primary)' }}>{data.avgProgress}%</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Avg Progress</p></div></div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading progress...</p>
        ) : data.courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '16px' }}>No progress data yet. Start learning!</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Course</th><th>Subject</th><th>Lessons</th><th>Progress</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {data.courses.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.title}</strong></td>
                      <td>{c.subject}</td>
                      <td>{c.completed_lessons || 0}/{c.lessons}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="progress" style={{ flex: 1, height: '8px' }}>
                            <div className="progress-fill" style={{ width: `${c.progress || 0}%` }}></div>
                          </div>
                          <span style={{ fontSize: '.85rem', fontWeight: 600 }}>{c.progress || 0}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${c.progress >= 100 ? 'badge-success' : c.progress > 0 ? 'badge-primary' : 'badge-warning'}`}>
                          {c.progress >= 100 ? 'Completed' : c.progress > 0 ? 'In Progress' : 'Not Started'}
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
