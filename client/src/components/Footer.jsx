import { useState } from 'react';
import { Link } from 'react-router-dom';
import { miscApi } from '../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await miscApi.newsletter(email);
      setMsg('🎉 Thank you for subscribing!');
      setEmail('');
    } catch (err) {
      setMsg('⚠️ ' + err.message);
    }
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="logo" style={{ color: '#fff' }}>
              <span className="logo-icon">🎓</span> Global Primary Learning Hub
            </Link>
            <p style={{ margin: '14px 0', fontSize: '.9rem' }}>
              Helping every primary school learner around the world succeed through interactive education.
            </p>
            <div className="social-links">
              <a href="#" title="Facebook">f</a><a href="#" title="Instagram">📷</a>
              <a href="#" title="YouTube">▶</a><a href="#" title="TikTok">♪</a>
              <a href="#" title="LinkedIn">in</a><a href="#" title="X">𝕏</a>
            </div>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/about">Blog</Link>
            <Link to="/about">Careers</Link>
            <Link to="/about">API</Link>
          </div>
          <div>
            <h4>Support</h4>
            <Link to="/about">Help Center</Link>
            <Link to="/about">FAQs</Link>
            <Link to="/about">Contact</Link>
            <Link to="/about">Privacy Policy</Link>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/courses">Courses</Link>
            <Link to="/subjects">Subjects</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Newsletter</h4>
            <p style={{ fontSize: '.85rem' }}>Get the latest education news and tips.</p>
            <form className="newsletter" onSubmit={handleSubscribe}>
              <input type="email" placeholder="Your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <button>Subscribe</button>
            </form>
            {msg && <small style={{ color: 'var(--secondary)', display: 'block', marginTop: '8px' }}>{msg}</small>}
            <p style={{ fontSize: '.8rem', marginTop: '12px' }}>📧 sibobugingostraton@gmail.com<br />📞 +250 725 396 080</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Global Primary Learning Hub. All rights reserved.</span>
          <span>🔒 SSL Secured · 🌍 Proudly serving 120+ countries</span>
        </div>
      </div>
    </footer>
  );
}
