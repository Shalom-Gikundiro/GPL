import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentApi } from '../../api';

export default function Certificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.certificates().then(setCertificates).catch(() => setCertificates([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a>📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <a href="#" className="active">📜 Certificates</a>
        <Link to="/student/progress"><a>📈 Learning Progress</a></Link>
        <Link to="/student/achievements"><a>🏅 Achievements</a></Link>
        <Link to="/student/leaderboard"><a>🏆 Leaderboard</a></Link>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library"><a>📚 Library</a></Link>
        <Link to="/student/live"><a>🔴 Live Classes</a></Link>
        <Link to="/student/ai-tutor"><a>🤖 AI Study Assistant</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Certificates 📜</h2>
          <p style={{ color: 'var(--text-light)' }}>Your earned certificates and achievements.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading certificates...</p>
        ) : certificates.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📜</div>
            <h3 style={{ marginBottom: '8px' }}>No Certificates Yet</h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '16px' }}>Complete a course to earn your first certificate!</p>
            <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
          </div>
        ) : (
          <div className="grid grid-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="card" style={{ textAlign: 'center', border: '2px solid var(--accent)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏆</div>
                <h3 style={{ margin: '0 0 8px' }}>{cert.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '.9rem', marginBottom: '12px' }}>{cert.subject}</p>
                <span className="badge badge-success">Verified ✅</span>
                <p style={{ color: 'var(--text-light)', fontSize: '.8rem', marginTop: '8px' }}>Issued: {cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
