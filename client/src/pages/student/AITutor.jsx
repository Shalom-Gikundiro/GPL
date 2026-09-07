import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AITutor() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm your AI Study Assistant. Ask me anything about your lessons!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      let reply = "That's a great question! Let me help you with that. Try checking your course materials or ask your teacher for more details.";
      const q = text.toLowerCase();
      if (q.includes('math')) reply = "For math help, I recommend practicing multiplication tables and trying our Counting & Numbers course!";
      else if (q.includes('science')) reply = "Science is all about experiments! Check out our Science Experiments course for hands-on learning.";
      else if (q.includes('english') || q.includes('reading')) reply = "Reading opens doors! Try our Reading Adventures course to improve your skills.";
      else if (q.includes('history')) reply = "History helps us understand the past. Our History Heroes course makes it fun!";
      setMessages((m) => [...m, { from: 'bot', text: reply }]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="dash-layout">
      <aside className="dash-tabs">
        <h3 style={{ padding: '12px 14px', marginBottom: '8px' }}>Student Menu</h3>
        <Link to="/dashboard"><a>📚 My Courses</a></Link>
        <Link to="/student/lessons"><a>🕒 Recent Lessons</a></Link>
        <Link to="/student/assignments"><a>📝 Assignments</a></Link>
        <Link to="/student/exams"><a>📊 Exam Scores</a></Link>
        <Link to="/student/certificates"><a>📜 Certificates</a></Link>
        <Link to="/student/progress"><a>📈 Learning Progress</a></Link>
        <Link to="/student/achievements"><a>🏅 Achievements</a></Link>
        <Link to="/student/leaderboard"><a>🏆 Leaderboard</a></Link>
        <Link to="/student/notifications"><a>🔔 Notifications</a></Link>
        <Link to="/messages"><a>💬 Messages</a></Link>
        <Link to="/student/library"><a>📚 Library</a></Link>
        <Link to="/student/live"><a>🔴 Live Classes</a></Link>
        <a href="#" className="active">🤖 AI Study Assistant</a>
      </aside>

      <main>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>AI Study Assistant 🤖</h2>
          <p style={{ color: 'var(--text-light)' }}>Ask me anything about your lessons, subjects, or study tips.</p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', maxWidth: '800px' }}>
          <div style={{ padding: '20px', maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
                background: m.from === 'user' ? 'var(--primary)' : 'var(--gray-2)',
                color: m.from === 'user' ? '#fff' : 'var(--text)',
                padding: '12px 16px',
                borderRadius: '14px',
                maxWidth: '80%',
                borderBottomLeftRadius: m.from === 'bot' ? '4px' : '14px',
                borderBottomRightRadius: m.from === 'user' ? '4px' : '14px'
              }}>
                {m.text}
              </div>
            ))}
            {typing && <div style={{ alignSelf: 'flex-start', background: 'var(--gray-2)', padding: '12px 16px', borderRadius: '14px', borderBottomLeftRadius: '4px' }}>Typing...</div>}
          </div>
          <div style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid var(--border)' }}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--text)' }}
            />
            <button onClick={send} className="btn btn-primary" style={{ padding: '10px 20px' }}>Send</button>
          </div>
        </div>
      </main>
    </div>
  );
}
