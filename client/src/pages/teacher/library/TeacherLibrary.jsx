import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { uploadApi } from '../../api';

export default function TeacherLibrary() {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    uploadApi.library().then(setFiles).catch(() => setFiles([])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this file?')) return;
    try {
      await uploadApi.deleteFile(id);
      setFiles(files.filter(f => f.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Teacher Menu</h3>
        <Link to="/dashboard"><a>📊 Dashboard</a></Link>
        <Link to="/teacher/classes"><a>📚 My Classes</a></Link>
        <Link to="/teacher/students"><a>👨‍🎓 Students</a></Link>
        <Link to="/teacher/assignments"><a>📝 Assignments</a></Link>
        <Link to="/teacher/grading"><a>✏️ Grading</a></Link>
        <Link to="/teacher/schedule"><a>📅 Schedule</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/teacher/resources"><a>📁 Resources</a></Link>
        <Link to="/teacher/reports"><a>📈 Reports</a></Link>
        <Link to="/teacher/upload"><a>⬆️ Upload</a></Link>
        <Link to="/teacher/library" className="active"><a>📚 Library</a></Link>
        <Link to="/teacher/live"><a>🔴 Live Teaching</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>My Library 📚</h2>
          <p style={{ color: 'var(--text-light)' }}>Files you have uploaded for students.</p>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-light)' }}>Loading library...</p>
        ) : files.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-light)' }}>No files uploaded yet. Go to Upload to add files.</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {files.map((f) => (
              <div key={f.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{f.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '.85rem' }}>{f.description || 'No description'}</p>
                  </div>
                  <span className="badge badge-primary">{f.grade_level || 'All'}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '.85rem', color: 'var(--text-light)', marginBottom: '12px' }}>
                  <span>📄 {f.filetype?.split('/')[1]?.toUpperCase()}</span>
                  <span>📥 {f.downloads} downloads</span>
                  <span>📅 {new Date(f.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href={`/uploads/${f.filename}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '.85rem' }}>Download</a>
                  {f.uploaded_by === user.id && <button onClick={() => handleDelete(f.id)} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '.85rem', color: 'var(--accent)', borderColor: 'var(--accent)' }}>Delete</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
