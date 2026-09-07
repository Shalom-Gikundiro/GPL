import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { parentApi } from '../../api';

export default function ParentSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({ notifications: true, emailReports: true, smsAlerts: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    parentApi.settings().then(setSettings).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await parentApi.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // silent
    }
    setSaving(false);
  };

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
        <Link to="/parent/billing"><a>💳 Billing</a></Link>
        <a href="#" className="active">⚙️ Settings</a>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Settings ⚙️</h2>
          <p style={{ color: 'var(--text-light)' }}>Manage your account preferences.</p>
        </div>

        <div className="card" style={{ maxWidth: '600px' }}>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} />
                <span style={{ fontWeight: 600 }}>Push Notifications</span>
              </label>
              <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginTop: '4px' }}>Receive notifications about your child's progress.</p>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={settings.emailReports} onChange={(e) => setSettings({ ...settings, emailReports: e.target.checked })} />
                <span style={{ fontWeight: 600 }}>Email Reports</span>
              </label>
              <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginTop: '4px' }}>Receive weekly progress reports via email.</p>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={settings.smsAlerts} onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })} />
                <span style={{ fontWeight: 600 }}>SMS Alerts</span>
              </label>
              <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginTop: '4px' }}>Get SMS alerts for important updates.</p>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : saved ? 'Saved! ✅' : 'Save Settings'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
