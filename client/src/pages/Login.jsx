import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h2>Welcome Back! 👋</h2>
        <p className="sub">Login to continue learning</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Email or Username</label><input type="text" className="form-control" name="email" required placeholder="Enter your email or username" value={form.email} onChange={handleChange} /></div>
          <div className="form-group"><label>Password</label><input type="password" className="form-control" name="password" required placeholder="Enter your password" value={form.password} onChange={handleChange} /></div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
          <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}></span>
          <span style={{ color: 'var(--text-light)', fontSize: '.8rem' }}>or</span>
          <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}></span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <button className="btn btn-outline" style={{ justifyContent: 'center' }}>📘 Google</button>
          <button className="btn btn-outline" style={{ justifyContent: 'center' }}>🎨 Apple</button>
        </div>

        <p className="auth-alt">Don't have an account? <Link to="/register">Register free</Link></p>
        <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--text-light)', marginTop: '14px' }}>
          Demo account: <strong>demo@gpl.com</strong> / <strong>demo123</strong>
        </p>
      </div>
    </div>
  );
}
