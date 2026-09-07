import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Subjects from './pages/Subjects';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/dashboards/AdminUsers';
import AdminCourses from './pages/dashboards/AdminCourses';
import Pricing from './pages/Pricing';

import StudentLessons from './pages/student/RecentLessons';
import StudentAssignments from './pages/student/Assignments';
import StudentExamScores from './pages/student/ExamScores';
import StudentCertificates from './pages/student/Certificates';
import StudentProgress from './pages/student/LearningProgress';
import StudentAchievements from './pages/student/Achievements';
import StudentLeaderboard from './pages/student/Leaderboard';
import StudentNotifications from './pages/student/Notifications';
import StudentAITutor from './pages/student/AITutor';
import StudentLibrary from './pages/student/library/StudentLibrary';
import StudentLive from './pages/student/live/StudentLive';

import ParentProgress from './pages/parent/Progress';
import ParentAttendance from './pages/parent/Attendance';
import ParentGrades from './pages/parent/Grades';
import ParentMessages from './pages/parent/TeacherMessages';
import ParentEvents from './pages/parent/Events';
import ParentBilling from './pages/parent/Billing';
import ParentSettings from './pages/parent/Settings';

import TeacherMyClasses from './pages/teacher/MyClasses';
import TeacherStudents from './pages/teacher/Students';
import TeacherAssignments from './pages/teacher/Assignments';
import TeacherGrading from './pages/teacher/Grading';
import TeacherSchedule from './pages/teacher/Schedule';
import TeacherMessages from './pages/teacher/Messages';
import TeacherResources from './pages/teacher/Resources';
import TeacherReports from './pages/teacher/Reports';
import TeacherUpload from './pages/teacher/upload/TeacherUpload';
import TeacherLibrary from './pages/teacher/library/TeacherLibrary';
import TeacherLive from './pages/teacher/live/TeacherLive';

import AdminEnrollments from './pages/admin/Enrollments';
import AdminReports from './pages/admin/Reports';
import AdminMessages from './pages/admin/AdminMessages';
import AdminNewsletter from './pages/admin/Newsletter';
import AdminSettings from './pages/admin/AdminSettings';

import Messages from './pages/Messages';

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/messages" element={<Messages />} />

          {/* Student */}
          <Route path="/student/lessons" element={<StudentLessons />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/exams" element={<StudentExamScores />} />
          <Route path="/student/certificates" element={<StudentCertificates />} />
          <Route path="/student/progress" element={<StudentProgress />} />
          <Route path="/student/achievements" element={<StudentAchievements />} />
          <Route path="/student/leaderboard" element={<StudentLeaderboard />} />
          <Route path="/student/notifications" element={<StudentNotifications />} />
          <Route path="/student/ai-tutor" element={<StudentAITutor />} />
          <Route path="/student/library" element={<StudentLibrary />} />
          <Route path="/student/live" element={<StudentLive />} />

          {/* Parent */}
          <Route path="/parent/progress" element={<ParentProgress />} />
          <Route path="/parent/attendance" element={<ParentAttendance />} />
          <Route path="/parent/grades" element={<ParentGrades />} />
          <Route path="/parent/messages" element={<ParentMessages />} />
          <Route path="/parent/events" element={<ParentEvents />} />
          <Route path="/parent/billing" element={<ParentBilling />} />
          <Route path="/parent/settings" element={<ParentSettings />} />

          {/* Teacher */}
          <Route path="/teacher/classes" element={<TeacherMyClasses />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/grading" element={<TeacherGrading />} />
          <Route path="/teacher/schedule" element={<TeacherSchedule />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />
          <Route path="/teacher/resources" element={<TeacherResources />} />
          <Route path="/teacher/reports" element={<TeacherReports />} />
          <Route path="/teacher/upload" element={<TeacherUpload />} />
          <Route path="/teacher/library" element={<TeacherLibrary />} />
          <Route path="/teacher/live" element={<TeacherLive />} />

          {/* Admin */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/newsletter" element={<AdminNewsletter />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
