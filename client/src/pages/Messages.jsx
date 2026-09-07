import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { messageApi } from '../api';

export default function Messages() {
  const { user } = useAuth();
  const [tab, setTab] = useState('inbox');
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [form, setForm] = useState({ receiverId: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sentFlag, setSentFlag] = useState(false);

  useEffect(() => {
    Promise.all([
      messageApi.inbox(),
      messageApi.sent(),
      messageApi.users()
    ])
      .then(([inboxData, sentData, usersData]) => {
        setInbox(inboxData);
        setSent(sentData);
        setUsers(usersData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sentFlag]);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await messageApi.send(form);
      setForm({ receiverId: '', subject: '', message: '' });
      setComposeOpen(false);
      setSentFlag((f) => !f);
    } catch {
      // silent
    }
    setSending(false);
  };

  const getReceiver = (id) => users.find((u) => u.id === Number(id));

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Messages</h3>
        <Link to="/dashboard"><a>📚 Dashboard</a></Link>
        <a href="#" className="active">💬 Messages</a>
      </aside>

      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Messages 💬</h2>
            <p style={{ color: 'var(--text-light)' }}>Send and receive messages with teachers, parents, and students.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setComposeOpen(true)}>✏️ Compose</button>
        </div>

        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
            <button
              onClick={() => setTab('inbox')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: 600,
                borderBottom: tab === 'inbox' ? '2px solid var(--primary)' : '2px solid transparent',
                color: tab === 'inbox' ? 'var(--primary)' : 'var(--text-light)'
              }}
            >
              📥 Inbox {inbox.filter((m) => !m.is_read).length > 0 && <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: '.75rem', marginLeft: '6px' }}>{inbox.filter((m) => !m.is_read).length}</span>}
            </button>
            <button
              onClick={() => setTab('sent')}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontWeight: 600,
                borderBottom: tab === 'sent' ? '2px solid var(--primary)' : '2px solid transparent',
                color: tab === 'sent' ? 'var(--primary)' : 'var(--text-light)'
              }}
            >
              📤 Sent
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: '40px' }}>Loading messages...</p>
          ) : tab === 'inbox' ? (
            inbox.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📭</div>
                <p style={{ color: 'var(--text-light)' }}>No messages in your inbox.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {inbox.map((m) => (
                  <div key={m.id} style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    padding: '16px',
                    background: m.is_read ? 'var(--bg)' : 'var(--primary-light)',
                    borderRadius: '10px',
                    borderLeft: m.is_read ? 'none' : '4px solid var(--primary)'
                  }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>{m.sender_first_name[0]}{m.sender_last_name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong>{m.sender_first_name} {m.sender_last_name} <span style={{ fontWeight: 400, color: 'var(--text-light)', fontSize: '.85rem' }}>({m.sender_role})</span></strong>
                        <small style={{ color: 'var(--text-light)' }}>{new Date(m.created_at).toLocaleDateString()}</small>
                      </div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{m.subject || 'No subject'}</h4>
                      <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            sent.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📤</div>
                <p style={{ color: 'var(--text-light)' }}>No sent messages.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sent.map((m) => (
                  <div key={m.id} style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    padding: '16px',
                    background: 'var(--bg)',
                    borderRadius: '10px',
                    opacity: 0.85
                  }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>{m.receiver_first_name?.[0] || '?'}{m.receiver_last_name?.[0] || ''}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong>To: {m.receiver_first_name} {m.receiver_last_name} <span style={{ fontWeight: 400, color: 'var(--text-light)', fontSize: '.85rem' }}>({m.receiver_role})</span></strong>
                        <small style={{ color: 'var(--text-light)' }}>{new Date(m.created_at).toLocaleDateString()}</small>
                      </div>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{m.subject || 'No subject'}</h4>
                      <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.9rem' }}>{m.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {composeOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setComposeOpen(false)}>
            <div style={{
              background: 'var(--bg)',
              padding: '24px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>✏️ Compose Message</h3>
                <button onClick={() => setComposeOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>×</button>
              </div>
              <form onSubmit={handleSend}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>To</label>
                  <select
                    className="form-control"
                    value={form.receiverId}
                    onChange={(e) => setForm({ ...form, receiverId: e.target.value })}
                    required
                  >
                    <option value="">Select recipient</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Enter subject"
                  />
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Message</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Write your message..."
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setComposeOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={sending}>{sending ? 'Sending...' : 'Send Message'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
