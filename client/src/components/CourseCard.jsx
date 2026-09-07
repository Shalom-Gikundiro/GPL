import { useAuth } from '../contexts/AuthContext';
import { courseApi } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ course }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await courseApi.enroll(course.id);
      alert('🎉 Enrolled successfully! You can now track this course in your dashboard.');
    } catch (err) {
      alert('⚠️ ' + err.message);
    }
  };

  return (
    <div className="card reveal">
      <div className={`icon icon-${course.color}`}>{course.icon}</div>
      <span className="badge badge-primary">{course.subject}</span>
      <h3>{course.title}</h3>
      <p>Grade: {course.grade} · Level: {course.level}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 700 }}>⭐ {Number(course.rating).toFixed(1)}</span>
        <span style={{ color: 'var(--text-light)', fontSize: '.85rem' }}>{course.lessons} lessons</span>
      </div>
      <div className="progress" style={{ marginTop: '12px' }}>
        <div className="progress-fill" style={{ width: `${20 + course.id * 6}%` }}></div>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} onClick={handleEnroll}>
        Enroll Now
      </button>
    </div>
  );
}
