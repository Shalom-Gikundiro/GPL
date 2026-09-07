import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';

export default function About() {
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / About</div>
          <h1>About Global Primary Learning Hub</h1>
          <p>Our mission is to make world-class primary education accessible to every child on Earth.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span className="tag" style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Our Mission</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '12px 0' }}>Education for Every Child, Everywhere</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: '16px' }}>
                Founded on a simple belief - that every child deserves a world-class education regardless of where they live.
                We combine expert teachers, AI technology, and engaging content to make learning joyful and effective.
              </p>
              <p style={{ color: 'var(--text-light)' }}>Our platform supports learners, teachers, parents, and schools with tools designed for the modern classroom.</p>
            </div>
            <div className="hero-card floating">
              <div className="hero-emoji">
                <div className="emoji-item">🌍<span>Global</span></div>
                <div className="emoji-item">🎓<span>Education</span></div>
                <div className="emoji-item">🤖<span>AI Tutor</span></div>
                <div className="emoji-item">🏆<span>Rewards</span></div>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 700, marginTop: '16px' }}>Making learning fun for everyone!</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-gray">
        <div className="container">
          <div className="section-head"><span className="tag">Our Values</span><h2>What We Stand For</h2></div>
          <div className="grid grid-3">
            <div className="card reveal"><div className="icon icon-blue">🎯</div><h3>Accessibility</h3><p>Quality education available to every child, in every country, regardless of background.</p></div>
            <div className="card reveal"><div className="icon icon-green">💡</div><h3>Innovation</h3><p>Using AI and modern technology to personalize and improve the learning experience.</p></div>
            <div className="card reveal"><div className="icon icon-orange">❤️</div><h3>Engagement</h3><p>Making learning fun through games, rewards, and interactive content.</p></div>
            <div className="card reveal"><div className="icon icon-purple">🤝</div><h3>Community</h3><p>Bringing students, parents, teachers, and schools together.</p></div>
            <div className="card reveal"><div className="icon icon-red">🔒</div><h3>Safety</h3><p>SSL encryption, GDPR compliance, and a safe environment for children.</p></div>
            <div className="card reveal"><div className="icon icon-cyan">🌱</div><h3>Growth</h3><p>Helping every learner reach their full potential.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><span className="tag">Our Numbers</span><h2>Impact So Far</h2></div>
          <div className="grid grid-4">
            <div className="card reveal" style={{ textAlign: 'center' }}><h2 style={{ color: 'var(--primary)', fontSize: '2.4rem' }}>50K+</h2><p>Active Learners</p></div>
            <div className="card reveal" style={{ textAlign: 'center' }}><h2 style={{ color: 'var(--secondary)', fontSize: '2.4rem' }}>120+</h2><p>Countries Served</p></div>
            <div className="card reveal" style={{ textAlign: 'center' }}><h2 style={{ color: 'var(--accent)', fontSize: '2.4rem' }}>10K+</h2><p>Lessons & Videos</p></div>
            <div className="card reveal" style={{ textAlign: 'center' }}><h2 style={{ color: 'var(--primary)', fontSize: '2.4rem' }}>5K+</h2><p>Teachers</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
