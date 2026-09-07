import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { courseApi } from '../api';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState(user?.grade || '');

  const loadCourses = (q = search, sf = subject, gr = grade) => {
    const params = {};
    if (q) params.search = q;
    if (sf) params.subject = sf;
    if (gr) params.grade = gr;
    courseApi.list(params).then(setCourses).catch(() => setCourses([]));
  };

  useEffect(() => {
    Promise.all([
      courseApi.subjects(),
      courseApi.grades()
    ]).then(([subjectsData, gradesData]) => {
      setSubjects(subjectsData);
      setGrades(gradesData);
    }).catch(() => {});
    
    if (user?.grade) {
      setGrade(user.grade);
      loadCourses(search, subject, user.grade);
    } else {
      loadCourses();
    }
    setLoading(false);
  }, [user?.grade]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCourses(search, subject, grade);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Courses</div>
          <h1>Explore Our Courses</h1>
          <p>Find the perfect course for your grade and interests.</p>
          <form className="search-bar" style={{ marginTop: '24px' }} onSubmit={handleSearch}>
            <input type="text" placeholder="Search courses, subjects, topics..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <button type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
            <select className="form-control" style={{ maxWidth: '260px' }} value={subject} onChange={(e) => { setSubject(e.target.value); loadCourses(search, e.target.value, grade); }}>
              <option value="">All Subjects</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="form-control" style={{ maxWidth: '260px' }} value={grade} onChange={(e) => { setGrade(e.target.value); loadCourses(search, subject, e.target.value); }}>
              <option value="">All Grades</option>
              {grades.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>Loading courses...</p>
          ) : courses.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>No courses found. Try a different search.</p>
          ) : (
            <div className="grid grid-3">
              {courses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
