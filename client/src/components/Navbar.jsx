import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ddOpen, setDdOpen] = useState(null);

  const closeAll = () => {
    setMobileOpen(false);
    setDdOpen(null);
  };

  const handleLogout = () => {
    logout();
    closeAll();
    navigate('/');
  };

  return (
    <>
      <div className="topbar">
        <div className="container">
          <div className="hide-sm">🎉 Special Launch Offer: 50% off Yearly Plan!</div>
          <div>📧 sibobugingostraton@gmail.com</div>
        </div>
      </div>

      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo" onClick={closeAll}>
            <span className="logo-icon">🎓</span> Global Primary Learning Hub
          </Link>

          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>

          <nav>
            <ul className={`nav ${mobileOpen ? 'open' : ''}`}>
              <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Home</NavLink></li>

              <li className="has-dropdown">
                <a href="#" onClick={(e) => { e.preventDefault(); setDdOpen(ddOpen === 'learn' ? null : 'learn'); }}>Learn ▾</a>
                <div className={`dropdown ${ddOpen === 'learn' ? 'show' : ''}`}>
                  <Link to="/about" onClick={closeAll}>📘 About</Link>
                  <Link to="/courses" onClick={closeAll}>📚 Courses</Link>
                  <Link to="/subjects" onClick={closeAll}>🧩 Subjects</Link>
                </div>
              </li>

              <li className="has-dropdown">
                <a href="#" onClick={(e) => { e.preventDefault(); setDdOpen(ddOpen === 'community' ? null : 'community'); }}>Community ▾</a>
                <div className={`dropdown ${ddOpen === 'community' ? 'show' : ''}`}>
                  <Link to="/about" onClick={closeAll}>👩‍🏫 Teachers</Link>
                  <Link to="/about" onClick={closeAll}>👨‍👩‍👧 Parents</Link>
                  <Link to="/about" onClick={closeAll}>🏫 Schools</Link>
                </div>
              </li>

              <li><NavLink to="/pricing" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>Pricing</NavLink></li>
              <li><NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>About</NavLink></li>
            </ul>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Dark mode" onClick={toggle}>
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary">🎒 Dashboard</Link>
                <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
