import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const roles = [
  { value: 'student', label: 'Student', icon: '🎒' },
  { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
  { value: 'teacher', label: 'Teacher', icon: '👩‍🏫' },
  { value: 'admin', label: 'School Admin', icon: '🏫' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', confirm: '', country: '', grade: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        username: form.username,
        password: form.password,
        role,
        country: form.country,
        grade: form.grade,
      });
      setSuccess('✅ Account created successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card wide">
        <h2>Create Your Free Account 🎉</h2>
        <p className="sub">Join Global Primary Learning Hub as a...</p>

        <div className="role-select">
          {roles.map((r) => (
            <button key={r.value} type="button" className={`role-btn ${role === r.value ? 'active' : ''}`} onClick={() => setRole(r.value)}>
              {r.icon}<br />{r.label}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>First Name</label><input type="text" className="form-control" name="firstName" required placeholder="Enter first name" value={form.firstName} onChange={handleChange} /></div>
            <div className="form-group"><label>Last Name</label><input type="text" className="form-control" name="lastName" required placeholder="Enter last name" value={form.lastName} onChange={handleChange} /></div>
            <div className="form-group">
              <label>Country</label>
              <select className="form-control" name="country" value={form.country} onChange={handleChange}>
                <option value="">Select country</option>
                {['Rwanda','Kenya','Nigeria','Ghana','South Africa','Uganda','Tanzania','United States','United Kingdom','Canada','France','India','Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Email</label><input type="email" className="form-control" name="email" required placeholder="you@email.com" value={form.email} onChange={handleChange} /></div>
            {(role === 'student' || role === 'parent') && (
              <div className="form-group">
                <label>Grade</label>
                <select className="form-control" name="grade" value={form.grade} onChange={handleChange}>
                  <option value="">Select grade</option>
                  {['Nursery','Kindergarten','Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6','Primary 7'].map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            )}
            <div className="form-group"><label>Username</label><input type="text" className="form-control" name="username" required placeholder="Choose a username" value={form.username} onChange={handleChange} /></div>
            <div className="form-group"><label>Password</label><input type="password" className="form-control" name="password" required placeholder="Create a password" value={form.password} onChange={handleChange} /></div>
            <div className="form-group"><label>Confirm Password</label><input type="password" className="form-control" name="confirm" required placeholder="Repeat password" value={form.confirm} onChange={handleChange} /></div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create Account</button>
        </form>

        <p className="auth-alt">Already have an account? <Link to="/login">Login here</Link></p>
        <p style={{ textAlign: 'center', fontSize: '.8rem', color: 'var(--text-light)', marginTop: '14px' }}>🔒 Secure & encrypted · GDPR compliant · Email verification</p>
      </div>
    </div>
  );
}
