import { useState } from 'react';
import { miscApi } from '../api';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! 👋 I'm your AI tutor. Ask me about any lesson or subject!" },
  ]);
  const [typing, setTyping] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setTyping(true);
    try {
      const data = await miscApi.chat(text);
      setMessages((m) => [...m, { from: 'bot', text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, I had trouble connecting. Please try again.' }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      <button className="chat-btn" id="chatBtn" aria-label="Chat" onClick={() => setOpen((o) => !o)}>💬</button>
      <div className={`chat-window ${open ? 'open' : ''}`}>
        <div className="chat-head">
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <div><strong>AI Study Assistant</strong><br /><small>Online</small></div>
        </div>
        <div className="chat-body">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.from}`}>{m.text}</div>
          ))}
          {typing && <div className="msg bot">Typing...</div>}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button onClick={send}>Send</button>
        </div>
      </div>
    </>
  );
}
