import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { uploadApi } from '../../api';

export default function StudentLibrary() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGrade, setFilterGrade] = useState(user?.grade || '');
  const [filterSubject, setFilterSubject] = useState('');

  useEffect(() => {
    const params = {};
    if (filterGrade) params.grade = filterGrade;
    if (filterSubject) params.subject = filterSubject;
    uploadApi.library(params).then(setFiles).catch(() => setFiles([])).finally(() => setLoading(false));
  }, [filterGrade, filterSubject]);

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a className="active">📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <Link to="/student/certificates"><a>📜 Certificates</a></Link>
        <Link to="/student/progress"><a>📈 Learning Progress</a></Link>
        <Link to="/student/achievements"><a>🏅 Achievements</a></Link>
        <Link to="/student/leaderboard"><a>🏆 Leaderboard</a></Link>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library" className="active"><a>📚 Library</a></Link>
        <Link to="/student/live"><a>🔴 Live Classes</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Library 📚</h2>
          <p style={{ color: 'var(--text-light)' }}>Browse and download study materials from your teachers.</p>
        </div>

        <div className="card" style={{ marginBottom: '24px', maxWidth: '600px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Grade Level</label>
              <select className="form-control" value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)}>
                <option value="">All Grades</option>
                <option value="Kindergarten">Kindergarten</option>
                <option value="Primary 1">Primary 1</option>
                <option value="Primary 2">Primary 2</option>
                <option value="Primary 3">Primary 3</option>
                <option value="Primary 4">Primary 4</option>
                <option value="Primary 5">Primary 5</option>
                <option value="Primary 6">Primary 6</option>
              </select>
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Subject</label>
              <select className="form-control" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
                <option value="History">History</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
                <option value="Art">Art</option>
                <option value="Music">Music</option>
                <option value="ICT">ICT</option>
                <option value="Environmental Studies">Environmental Studies</option>
                <option value="Health Education">Health Education</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Physical Education">Physical Education</option>
                <option value="French">French</option>
                <option value="Kinyarwanda">Kinyarwanda</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading library...</p>
        ) : files.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No files available yet. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {files.map((f) => (
              <div key={f.id} className="card">
                <div style={{ marginBottom: '12px' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{f.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.85rem' }}>{f.description || 'No description'}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '.85rem', color: 'var(--text-light)', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {f.grade_level && <span>🎓 {f.grade_level}</span>}
                  {f.subject && <span>📚 {f.subject}</span>}
                  <span>📥 {f.downloads} downloads</span>
                </div>
                <a href={`/uploads/${f.filename}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '.85rem' }}>
                  {f.filetype?.startsWith('video/') ? '▶ Watch' : '📄 Download'}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
