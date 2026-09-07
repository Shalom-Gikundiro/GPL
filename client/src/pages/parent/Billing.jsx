import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi } from '../../api';

export default function Billing() {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      parentApi.billing(),
      parentApi.children()
    ])
      .then(([billsData, childrenData]) => {
        setBills(billsData);
        setChildren(childrenData);
      })
      .catch(() => { setBills([]); setChildren([]); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Parent Menu</h3>
        <Link to="/dashboard"><a>🏠 Overview</a></Link>
        <Link to="/parent/progress"><a>📈 Progress</a></Link>
        <Link to="/parent/attendance"><a>📅 Attendance</a></Link>
        <Link to="/parent/grades"><a>📊 Grades</a></Link>
        <Link to="/messages"><a>💬 Teacher Messages</a></Link>
        <Link to="/parent/events"><a>📅 Events</a></Link>
        <a href="#" className="active">💳 Billing</a>
        <Link to="/parent/settings"><a>⚙️ Settings</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Billing 💳</h2>
          <p style={{ color: 'var(--text-light)' }}>View and manage your payment history.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading billing...</p>
        ) : children.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👶</div>
            <h3 style={{ marginBottom: '8px' }}>No Children Linked</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '16px' }}>Link a child account to view billing information.</p>
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          </div>
        ) : bills.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No billing records yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {bills.map((b) => (
                    <tr key={b.id}>
                      <td>{new Date(b.date).toLocaleDateString()}</td>
                      <td>{b.desc}</td>
                      <td>${b.amount.toFixed(2)}</td>
                      <td><span className={`badge ${b.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
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
