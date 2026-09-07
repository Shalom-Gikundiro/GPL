import { Link } from 'react-router-dom';
import useReveal from '../hooks/useReveal';

const subjectData = [
  { icon: '🔢', color: 'blue', name: 'Mathematics', desc: 'Numbers, algebra, geometry, and problem-solving.' },
  { icon: '📖', color: 'green', name: 'English', desc: 'Reading, writing, grammar, and vocabulary.' },
  { icon: '🔬', color: 'orange', name: 'Science', desc: 'Experiments, biology, chemistry, and physics.' },
  { icon: '🌍', color: 'purple', name: 'Social Studies', desc: 'Understanding society, culture, and community.' },
  { icon: '🏛️', color: 'red', name: 'History', desc: 'World history and key historical events.' },
  { icon: '📚', color: 'blue', name: 'Reading', desc: 'Phonics, comprehension, and storytelling.' },
  { icon: '✍️', color: 'green', name: 'Writing', desc: 'Creative writing, essays, and handwriting.' },
  { icon: '📝', color: 'orange', name: 'Grammar', desc: 'Sentence structure, punctuation, and rules.' },
  { icon: '🎨', color: 'purple', name: 'Art', desc: 'Drawing, painting, and creative expression.' },
  { icon: '🎵', color: 'red', name: 'Music', desc: 'Instruments, rhythm, and singing.' },
  { icon: '💻', color: 'cyan', name: 'ICT & Computer Studies', desc: 'Digital skills, typing, and computer basics.' },
  { icon: '🌱', color: 'blue', name: 'Environmental Studies', desc: 'Nature, sustainability, and conservation.' },
  { icon: '🕌', color: 'green', name: 'Religious Education', desc: 'Values, ethics, and world religions.' },
  { icon: '❤️', color: 'orange', name: 'Health Education', desc: 'Wellness, nutrition, and hygiene.' },
  { icon: '🌾', color: 'purple', name: 'Agriculture', desc: 'Farming, plants, and food production.' },
  { icon: '⚽', color: 'red', name: 'Physical Education', desc: 'Sports, exercise, and teamwork.' },
  { icon: '🧠', color: 'cyan', name: 'General Knowledge', desc: 'Quizzes, facts, and curiosity.' },
  { icon: '💡', color: 'blue', name: 'Critical Thinking', desc: 'Logic, reasoning, and problem-solving.' },
  { icon: '🌟', color: 'green', name: 'Life Skills', desc: 'Daily living, communication, and confidence.' },
  { icon: '💰', color: 'orange', name: 'Financial Literacy', desc: 'Saving, budgeting, and money basics.' },
  { icon: '🦾', color: 'red', name: 'Robotics Basics', desc: 'Building and programming simple robots.' },
  { icon: '🇫🇷', color: 'cyan', name: 'French', desc: 'Speak, read, and write in French.' },
  { icon: '🇷🇼', color: 'purple', name: 'Kinyarwanda', desc: 'The language of Rwanda.' },
];

export default function Subjects() {
  const revealRef = useReveal();
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Subjects</div>
          <h1>Complete Subject Curriculum</h1>
          <p>Every primary school subject, taught in a fun and engaging way.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-3" ref={revealRef}>
            {subjectData.map((s, i) => (
              <div className={`card reveal ${i % 2 ? '' : ''}`} key={s.name}>
                <div className={`icon icon-${s.color}`}>{s.icon}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <Link to="/courses" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}>View Courses</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
