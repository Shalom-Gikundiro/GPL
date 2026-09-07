import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { uploadApi } from '../../api';

export default function TeacherUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', description: '', gradeLevel: '', subject: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMsg('');
    const fileInput = document.getElementById('upload-file');
    const file = fileInput?.files?.[0];
    if (!file) {
      setMsg('⚠️ Please select a file.');
      setUploading(false);
      return;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('gradeLevel', form.gradeLevel);
    fd.append('subject', form.subject);
    try {
      const res = await uploadApi.upload(fd);
      setMsg('✅ File uploaded successfully!');
      setForm({ title: '', description: '', gradeLevel: '', subject: '' });
      fileInput.value = '';
    } catch (err) {
      setMsg('⚠️ ' + (err.message || 'Upload failed.'));
    }
    setUploading(false);
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
        <Link to="/teacher/upload" className="active"><a>⬆️ Upload</a></Link>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Upload Files ⬆️</h2>
          <p style={{ color: 'var(--text-light)' }}>Upload documents, videos, and study materials for your students.</p>
        </div>

        <div className="card" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Select File *</label>
              <input type="file" id="upload-file" className="form-control" required />
              <small style={{ color: 'var(--text-light)' }}>Accepted: PDF, DOC, DOCX, PPT, PPTX, TXT, MP4, WEBM, JPG, PNG, GIF (Max 100MB)</small>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Title *</label>
              <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Mathematics Worksheet 5" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Brief description of the file..."></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Grade Level</label>
                <select className="form-control" name="gradeLevel" value={form.gradeLevel} onChange={handleChange}>
                  <option value="">Select grade</option>
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Primary 1">Primary 1</option>
                  <option value="Primary 2">Primary 2</option>
                  <option value="Primary 3">Primary 3</option>
                  <option value="Primary 4">Primary 4</option>
                  <option value="Primary 5">Primary 5</option>
                  <option value="Primary 6">Primary 6</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '.9rem' }}>Subject</label>
                <select className="form-control" name="subject" value={form.subject} onChange={handleChange}>
                  <option value="">Select subject</option>
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
            <button type="submit" className="btn btn-primary" disabled={uploading} style={{ width: '100%', justifyContent: 'center' }}>
              {uploading ? 'Uploading...' : '⬆️ Upload File'}
            </button>
            {msg && <p style={{ marginTop: '12px', fontWeight: 600, color: msg.startsWith('⚠️') ? 'var(--accent)' : 'var(--secondary)' }}>{msg}</p>}
          </form>
        </div>
      </main>
    </div>
  );
}
