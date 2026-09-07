import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi, messageApi } from '../../api';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [childrenProgress, setChildrenProgress] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkForm, setLinkForm] = useState({ usernameOrEmail: '' });
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState('');

  useEffect(() => {
    parentApi.children()
      .then(async (kids) => {
        setChildren(kids);
        const progressMap = {};
        for (const child of kids) {
          try {
            const data = await parentApi.childProgress(child.id);
            progressMap[child.id] = data;
          } catch {
            progressMap[child.id] = { enrollments: [], avgProgress: 0 };
          }
        }
        setChildrenProgress(progressMap);
      })
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    messageApi.inbox().then(setMessages).catch(() => setMessages([]));
  }, []);

  const handleLinkChild = async (e) => {
    e.preventDefault();
    setLinking(true);
    setLinkMsg('');
    try {
      const res = await parentApi.linkChild({ childUsernameOrEmail: linkForm.usernameOrEmail });
      setLinkMsg('✅ ' + res.message);
      setLinkForm({ usernameOrEmail: '' });
      window.location.reload();
    } catch (err) {
      setLinkMsg('⚠️ ' + (err.message || 'Failed to link child.'));
    }
    setLinking(false);
  };

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Parent Menu</h3>
        <Link to="/dashboard"><a className="active">🏠 Overview</a></Link>
        <Link to="/parent/progress"><a>📈 Progress</a></Link>
        <Link to="/parent/attendance"><a>📅 Attendance</a></Link>
        <Link to="/parent/grades"><a>📊 Grades</a></Link>
        <Link to="/messages"><a>💬 Teacher Messages</a></Link>
        <Link to="/parent/events"><a>📅 Events</a></Link>
        <Link to="/parent/billing"><a>💳 Billing</a></Link>
        <Link to="/parent/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Parent Dashboard 👨‍👩‍👧</h2>
          <p style={{ color: 'var(--text-light)' }}>Monitor your child's learning journey and stay connected with teachers.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading...</p>
        ) : children.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👶</div>
            <h3 style={{ marginBottom: '8px' }}>No Children Linked</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>Link your child's account to monitor their learning progress, grades, and more.</p>
            <form onSubmit={handleLinkChild} style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Child's Username or Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={linkForm.usernameOrEmail}
                  onChange={(e) => setLinkForm({ usernameOrEmail: e.target.value })}
                  placeholder="Enter your child's username or email"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={linking}>
                {linking ? 'Linking...' : '🔗 Link Child'}
              </button>
              {linkMsg && <p style={{ marginTop: '10px', color: linkMsg.startsWith('⚠️') ? 'var(--accent)' : 'var(--secondary)', fontWeight: 600 }}>{linkMsg}</p>}
            </form>
          </div>
        ) : (
          <>
            <div className="grid grid-3" style={{ marginBottom: '24px' }}>
              <div className="stat-card"><div className="s-icon icon-blue">📚</div><div><h3 style={{ color: 'var(--primary)' }}>{children.length}</h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Children</p></div></div>
              <div className="stat-card"><div className="s-icon icon-green">📈</div><div><h3 style={{ color: 'var(--secondary)' }}>
                {Math.round(children.reduce((sum, c) => sum + (childrenProgress[c.id]?.avgProgress || 0), 0) / children.length)}%
              </h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Avg Progress</p></div></div>
              <div className="stat-card"><div className="s-icon icon-orange">⭐</div><div><h3 style={{ color: 'var(--accent)' }}>
                {children.length > 0 ? Math.round(children.reduce((sum, c) => sum + (c.xp || 0), 0) / children.length) : 0}
              </h3><p style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>Avg XP</p></div></div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '14px' }}>👶 Child Overview</h3>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {children.map((child) => {
                  const progress = childrenProgress[child.id] || {};
                  return (
                    <div key={child.id} style={{ flex: '1 1 280px', background: 'var(--gray)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>{child.first_name[0]}{child.last_name[0]}</div>
                        <div>
                          <h4 style={{ margin: 0 }}>{child.first_name} {child.last_name}</h4>
                          <small style={{ color: 'var(--text-light)' }}>{child.grade || 'No grade set'}</small>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '.9rem' }}>
                        <div><strong>Progress:</strong> {progress.avgProgress || 0}%</div>
                        <div><strong>Courses:</strong> {(progress.enrollments || []).length}</div>
                        <div><strong>Coins:</strong> {child.coins || 0}</div>
                        <div><strong>XP:</strong> {child.xp || 0}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '24px' }}>
              <div className="card">
                <h3 style={{ marginBottom: '14px' }}>📅 Attendance This Month</h3>
                <p style={{ color: 'var(--text-light)' }}>Attendance tracking will be available once your child starts attending live classes.</p>
              </div>
              <div className="card">
                <h3 style={{ marginBottom: '14px' }}>📊 Recent Grades</h3>
                {children.map((child) => {
                  const progress = childrenProgress[child.id] || {};
                  const enrollments = progress.enrollments || [];
                  if (enrollments.length === 0) return <p key={child.id} style={{ color: 'var(--text-light)' }}>No grades yet for {child.first_name}.</p>;
                  return (
                    <div key={child.id} style={{ marginBottom: '12px' }}>
                      <h4 style={{ margin: '0 0 8px', fontSize: '1rem' }}>{child.first_name}</h4>
                      <div className="table-wrap">
                        <table>
                          <tbody>
                            {enrollments.slice(0, 3).map((e, i) => (
                              <tr key={i}>
                                <td>{e.title}</td>
                                <td>{e.progress || 0}%</td>
                                <td>
                                  <span className={`badge ${(e.progress || 0) >= 80 ? 'badge-success' : (e.progress || 0) >= 50 ? 'badge-primary' : 'badge-warning'}`}>
                                    {(e.progress || 0) >= 80 ? 'A' : (e.progress || 0) >= 50 ? 'B' : 'C'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '14px' }}>💬 Messages from Teachers</h3>
              {messages.length === 0 ? (
                <p style={{ color: 'var(--text-light)' }}>No messages yet. Teachers will send updates here.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {messages.slice(0, 5).map((m) => (
                    <div key={m.id} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', background: 'var(--gray)', borderRadius: '8px' }}>
                      <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '.9rem' }}>{m.sender_first_name[0]}{m.sender_last_name[0]}</div>
                      <div>
                        <strong>{m.sender_first_name} {m.sender_last_name}</strong> <small style={{ color: 'var(--text-light)' }}>· {new Date(m.created_at).toLocaleDateString()}</small>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-light)', fontSize: '.9rem' }}>{m.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '14px' }}>📅 Upcoming Events</h3>
              <p style={{ color: 'var(--text-light)' }}>School events and parent-teacher meetings will appear here.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
