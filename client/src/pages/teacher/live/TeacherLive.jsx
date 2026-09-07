import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { liveApi } from '../../api';

export default function TeacherLive() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', subject: '', grade: '', scheduledAt: '', streamUrl: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    liveApi.list().then(setSessions).catch(() => setSessions([])).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await liveApi.create(form);
      setSessions([res, ...sessions]);
      setShowForm(false);
      setForm({ title: '', description: '', subject: '', grade: '', scheduledAt: '', streamUrl: '' });
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleStart = async (id) => {
    try {
      await liveApi.start(id);
      setSessions(sessions.map(s => s.id === id ? { ...s, status: 'live' } : s));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEnd = async (id) => {
    try {
      await liveApi.end(id);
      setSessions(sessions.map(s => s.id === id ? { ...s, status: 'ended' } : s));
    } catch (err) {
      alert(err.message);
    }
  };

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
        <Link to="/teacher/resources"><a>📁 Resources</a></Link>
        <Link to="/teacher/reports"><a>📈 Reports</a></Link>
        <Link to="/teacher/upload"><a>⬆️ Upload</a></Link>
        <Link to="/teacher/library"><a>📚 Library</a></Link>
        <Link to="/teacher/live" className="active"><a>🔴 Live Teaching</a></Link>
      </aside>

      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Live Teaching 🔴</h2>
            <p style={{ color: 'var(--text-light)' }}>Schedule and manage live sessions for your students.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ New Session</button>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: '24px', maxWidth: '700px' }}>
            <h3 style={{ marginBottom: '14px' }}>Create Live Session</h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Title *</label>
                <input type="text" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Mathematics - Primary 4" />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Description</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will you teach?"></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Subject</label>
                  <input type="text" className="form-control" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics" />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Grade</label>
                  <select className="form-control" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })}>
                    <option value="">Select grade</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Primary 1">Primary 1</option>
                    <option value="Primary 2">Primary 2</option>
                    <option value="Primary 3">Primary 3</option>
                    <option value="Primary 4">Primary 4</option>
                    <option value="Primary 5">Primary 5</option>
                    <option value="Primary 6">Primary 6</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Scheduled At</label>
                <input type="datetime-local" className="form-control" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Stream URL (YouTube, Zoom, etc.)</label>
                <input type="url" className="form-control" value={form.streamUrl} onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} placeholder="https://..." />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>Create Session</button>
            </form>
          </div>
        )}

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading sessions...</p>
        ) : sessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No live sessions yet. Create one to start teaching!</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {sessions.map((s) => (
              <div key={s.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px' }}>{s.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>{s.description || 'No description'}</p>
                  </div>
                  <span className={`badge ${s.status === 'live' ? 'badge-error' : s.status === 'ended' ? 'badge-warning' : 'badge-primary'}`}>{s.status}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '.85rem', color: 'var(--text-light)', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {s.subject && <span>📚 {s.subject}</span>}
                  {s.grade && <span>🎓 {s.grade}</span>}
                  {s.scheduled_at && <span>📅 {new Date(s.scheduled_at).toLocaleString()}</span>}
                </div>
                {s.status === 'scheduled' && s.teacher_id === user.id && (
                  <button onClick={() => handleStart(s.id)} className="btn btn-primary" style={{ marginRight: '8px' }}>🔴 Start Live</button>
                )}
                {s.status === 'live' && (
                  <>
                    {s.stream_url && <a href={s.stream_url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginRight: '8px' }}>▶ Join Stream</a>}
                    {s.teacher_id === user.id && <button onClick={() => handleEnd(s.id)} className="btn btn-outline">⏹ End Session</button>}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
