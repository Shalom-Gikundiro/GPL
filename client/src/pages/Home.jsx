import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../api';
import CourseCard from '../components/CourseCard';
import useReveal from '../hooks/useReveal';

const staticSubjects = [
  'Mathematics','English','Science','Social Studies','History','Reading','Writing',
  'Art','Music','ICT','Environmental Studies','Health Education','Agriculture','Physical Education',
  'Robotics Basics','French','Kinyarwanda'
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const revealRef = useReveal();

  useEffect(() => {
    courseApi.list()
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">✨ AI-Powered Learning Platform</span>
            <h1>Learn Anything.<br /><span className="gradient">Anywhere. Anytime.</span></h1>
            <p>Helping every primary school learner around the world succeed through interactive education.</p>
            <div className="hero-btns">
              <Link to="/courses" className="btn btn-primary">🚀 Start Learning</Link>
              <Link to="/register" className="btn btn-secondary">🎁 Register Free</Link>
            </div>
            <div className="hero-stats">
              <div className="hstat"><h3>30+</h3><p>Subjects</p></div>
              <div className="hstat"><h3>10K+</h3><p>Lessons</p></div>
              <div className="hstat"><h3>50K+</h3><p>Learners</p></div>
              <div className="hstat"><h3>120+</h3><p>Countries</p></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card floating">
              <div className="hero-emoji">
                <div className="emoji-item">📚<span>Books</span></div>
                <div className="emoji-item">💻<span>Laptops</span></div>
                <div className="emoji-item">📱<span>Tablets</span></div>
                <div className="emoji-item">🌍<span>Globe</span></div>
              </div>
              <div className="hero-chart">
                <div className="bar-row"><span>Math</span><div className="bar" style={{ width: '90%' }}></div></div>
                <div className="bar-row"><span>Science</span><div className="bar" style={{ width: '75%' }}></div></div>
                <div className="bar-row"><span>Reading</span><div className="bar" style={{ width: '85%' }}></div></div>
                <div className="bar-row"><span>Coding</span><div className="bar" style={{ width: '60%' }}></div></div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '14px', color: 'var(--secondary)', fontWeight: 700 }}>🎯 92% of learners improve their grades!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="tag">Complete Curriculum</span>
            <h2>Explore Our Subjects</h2>
            <p>From mathematics to coding, from languages to life skills - we cover every primary school subject.</p>
          </div>
          <div className="chips">
            {staticSubjects.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-head">
            <span className="tag">Why Choose Us</span>
            <h2>Everything Your Child Needs to Succeed</h2>
          </div>
          <div className="grid grid-3" ref={revealRef}>
            <div className="card reveal"><div className="icon icon-blue">🤖</div><h3>AI Study Assistant</h3><p>24/7 AI tutor that explains lessons and creates personalized practice.</p></div>
            <div className="card reveal"><div className="icon icon-green">🏆</div><h3>Gamified Learning</h3><p>Earn coins, XP, badges, and certificates through fun challenges.</p></div>
            <div className="card reveal"><div className="icon icon-orange">🎥</div><h3>Video Lessons</h3><p>Thousands of engaging videos organized by subject and grade.</p></div>
            <div className="card reveal"><div className="icon icon-purple">📚</div><h3>Digital Library</h3><p>Books, past papers, worksheets, and printable resources.</p></div>
            <div className="card reveal"><div className="icon icon-red">💬</div><h3>Live Classes</h3><p>Interactive live classes with chat and recordings.</p></div>
            <div className="card reveal"><div className="icon icon-cyan">📊</div><h3>Parent Tracking</h3><p>Monitor progress, attendance, and scores in real time.</p></div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-head">
            <span className="tag">Popular Courses</span>
            <h2>Featured Courses</h2>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Loading courses...</p>
          ) : (
            <div className="grid grid-3">
              {courses.slice(0, 6).map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="tag">How It Works</span>
            <h2>Start Learning in 3 Easy Steps</h2>
          </div>
          <div className="grid grid-3">
            <div className="card step reveal"><div className="step-num">1</div><h3>Register Free</h3><p>Create your account as a student, parent, teacher, or school in under a minute.</p></div>
            <div className="card step reveal"><div className="step-num">2</div><h3>Choose Your Path</h3><p>Pick your grade and subjects. Our AI recommends the perfect learning plan.</p></div>
            <div className="card step reveal"><div className="step-num">3</div><h3>Learn & Earn</h3><p>Watch lessons, play games, earn rewards, and earn verified certificates.</p></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-head">
            <span className="tag">Testimonials</span>
            <h2>Loved by Students, Parents & Teachers</h2>
          </div>
          <div className="grid grid-3">
            <div className="testimonial reveal">
              <div className="stars">★★★★★</div>
              <p>"My daughter improved from failing math to the top of her class in just 3 months. The AI tutor is amazing!"</p>
              <div className="t-author"><div className="avatar">MG</div><div><strong>Marie G.</strong><br /><small>Parent · Rwanda</small></div></div>
            </div>
            <div className="testimonial reveal">
              <div className="stars">★★★★★</div>
              <p>"The interactive games and rewards keep my students engaged. Best teaching tool I've ever used."</p>
              <div className="t-author"><div className="avatar">TK</div><div><strong>Teacher Kofi</strong><br /><small>Teacher · Ghana</small></div></div>
            </div>
            <div className="testimonial reveal">
              <div className="stars">★★★★★</div>
              <p>"I love earning coins and badges! The science experiments are so much fun!"</p>
              <div className="t-author"><div className="avatar">AS</div><div><strong>Amara S.</strong><br /><small>Student · Nigeria</small></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ textAlign: 'center', padding: '60px', background: 'linear-gradient(135deg,var(--primary),var(--secondary))', color: '#fff', border: 'none' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '14px' }}>Ready to Start Learning?</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 28px', color: '#E0F2FE' }}>Join thousands of happy learners worldwide. It's free to start!</p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-accent">🎁 Register Free</Link>
              <Link to="/pricing" className="btn" style={{ background: '#fff', color: 'var(--primary)' }}>View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
