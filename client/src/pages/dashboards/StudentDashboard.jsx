import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { courseApi, studentApi } from '../../api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkForm, setLinkForm] = useState({ usernameOrEmail: '' });
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState('');

  useEffect(() => {
    courseApi.mine()
      .then(setEnrolled)
      .catch(() => setEnrolled([]))
      .finally(() => setLoading(false));
  }, []);

  const totalProgress = enrolled.length
    ? Math.round(enrolled.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolled.length)
    : 0;

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a className="active">📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Welcome back, {user?.firstName}! 👋</h2>
          <p style={{ color: 'var(--text-light)' }}>Here's what's happening with your learning today.</p>
        </div>

        <div className="grid grid-4" style={{ marginBottom: '24px' }}>
          <div className="stat-card"><div className="s-icon icon-blue">📚</div><div><h3 style={{ color: 'var(--primary)' }}>{enrolled.length}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>My Courses</p></div></div>
          <div className="stat-card"><div className="s-icon icon-green">🪙</div><div><h3 style={{ color: 'var(--secondary)' }}>{user?.coins || 0}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Coins</p></div></div>
          <div className="stat-card"><div className="s-icon icon-orange">⭐</div><div><h3 style={{ color: 'var(--accent)' }}>{user?.xp || 0}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>XP Points</p></div></div>
          <div className="stat-card"><div className="s-icon icon-purple">🏅</div><div><h3 style={{ color: 'var(--primary)' }}>{Math.floor((user?.xp || 0) / 100)}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Badges</p></div></div>
        </div>

        <div className="card" style={{ marginBottom: '24px', border: '2px dashed var(--border)', background: 'var(--gray)' }}>
          <h3 style={{ marginBottom: '8px' }}>👨‍👩‍👧 Link Your Parent</h3>
          <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginBottom: '14px' }}>Ask your parent/guardian to register, then link their account here to share your progress with them.</p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLinking(true);
            setLinkMsg('');
            try {
              const res = await studentApi.linkParent({ parentUsernameOrEmail: linkForm.usernameOrEmail });
              setLinkMsg('✅ ' + res.message);
              setLinkForm({ usernameOrEmail: '' });
            } catch (err) {
              setLinkMsg('⚠️ ' + (err.message || 'Failed to link parent.'));
            }
            setLinking(false);
          }} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 240px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.85rem' }}>Parent's Username or Email</label>
              <input
                type="text"
                className="form-control"
                value={linkForm.usernameOrEmail}
                onChange={(e) => setLinkForm({ usernameOrEmail: e.target.value })}
                placeholder="Enter parent's username or email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={linking}>
              {linking ? 'Linking...' : '🔗 Link Parent'}
            </button>
          </form>
          {linkMsg && <p style={{ marginTop: '10px', fontWeight: 600, color: linkMsg.startsWith('⚠️') ? 'var(--accent)' : 'var(--secondary)' }}>{linkMsg}</p>}
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <h3>📈 Overall Learning Progress</h3>
          <div className="progress" style={{ marginTop: '14px', height: '14px' }}>
            <div className="progress-fill" style={{ width: `${totalProgress}%` }}></div>
          </div>
          <p style={{ color: 'var(--secondary)', fontWeight: 700, marginTop: '8px' }}>{totalProgress}% complete - Great job! Keep going! 🌟</p>
        </div>

        <h3 style={{ marginBottom: '14px' }}>My Courses</h3>
        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading your courses...</p>
        ) : enrolled.length === 0 ? (
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-light)', marginBottom: '16px' }}>You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid grid-2" style={{ marginBottom: '24px' }}>
            {enrolled.map((c) => (
              <div className="card" key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="badge badge-primary">{c.subject}</span>
                  <span style={{ color: 'var(--accent)' }}>⭐ {Number(c.rating).toFixed(1)}</span>
                </div>
                <h3 style={{ margin: '10px 0' }}>{c.title}</h3>
                <div className="progress"><div className="progress-fill" style={{ width: `${c.progress || 0}%` }}></div></div>
                <p style={{ color: 'var(--text-light)', fontSize: '.85rem', marginTop: '6px' }}>{c.progress || 0}% complete · {c.completed_lessons || 0}/{c.lessons} lessons</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-2" style={{ marginBottom: '24px' }}>
          <div className="card">
            <h3 style={{ marginBottom: '14px' }}>📝 Recent Assignments</h3>
            <p style={{ color: 'var(--text-light)' }}>No assignments yet. Assignments will appear here once your teachers create them.</p>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '14px' }}>📊 Exam Scores</h3>
             <p style={{ color: 'var(--text-light)' }}>No exam scores yet. Results will appear here after you complete assessments.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
