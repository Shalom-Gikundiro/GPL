import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminApi } from '../../api';

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Global Primary Learning Hub',
    maintenanceMode: false,
    registrationOpen: true,
    emailNotifications: true,
    defaultRole: 'student'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.settings().then(setSettings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings(settings);
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
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Admin Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/admin/users"><a>👥 Users</a></Link>
        <Link to="/admin/courses"><a>📚 Courses</a></Link>
        <Link to="/admin/enrollments"><a>📝 Enrollments</a></Link>
        <Link to="/admin/reports"><a>📈 Reports</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/admin/newsletter"><a>📧 Newsletter</a></Link>
        <a href="#" className="active">⚙️ Settings</a>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Settings ⚙️</h2>
          <p style={{ color: 'var(--text-light)' }}>Platform configuration and preferences.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading settings...</p>
        ) : (
          <div className="card" style={{ maxWidth: '600px' }}>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Site Name</label>
                <input type="text" className="form-control" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })} />
                  <span style={{ fontWeight: 600 }}>Maintenance Mode</span>
                </label>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginTop: '4px' }}>Temporarily disable the site for maintenance.</p>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.registrationOpen} onChange={(e) => setSettings({ ...settings, registrationOpen: e.target.checked })} />
                  <span style={{ fontWeight: 600 }}>Open Registration</span>
                </label>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginTop: '4px' }}>Allow new users to register.</p>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} />
                  <span style={{ fontWeight: 600 }}>Email Notifications</span>
                </label>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginTop: '4px' }}>Send system emails to users.</p>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : saved ? 'Saved! ✅' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
