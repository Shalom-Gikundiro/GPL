// Seed data for the Global Primary Learning Hub

export const subjects = [
  'Mathematics','English','Science','Social Studies','History','Reading','Writing','Grammar',
  'Art','Music','ICT','Computer Studies','Environmental Studies','Religious Education','Health Education',
  'Agriculture','Physical Education','General Knowledge','Critical Thinking','Life Skills','Financial Literacy',
  'Robotics Basics','French','Kinyarwanda','Other Languages'
];

export const grades = ['Nursery','Kindergarten','Primary 1','Primary 2','Primary 3','Primary 4','Primary 5','Primary 6','Primary 7'];

export const courses = [
  { id: 1,    title: 'Counting & Numbers',       subject: 'Mathematics',            grade: 'Primary 1', level: 'Beginner', lessons: 12, rating: 4.8, color: 'blue', icon: '🔢' },
  { id: 2,    title: 'Reading Adventures',        subject: 'English',                grade: 'Primary 2', level: 'Beginner', lessons: 15, rating: 4.9, color: 'green', icon: '📖' },
  { id: 4,    title: 'Multiplication Mastery',    subject: 'Mathematics',            grade: 'Primary 4', level: 'Intermediate', lessons: 14, rating: 4.9, color: 'purple', icon: '✖️' },
  { id: 5,    title: 'Science Experiments',       subject: 'Science',                grade: 'Primary 5', level: 'Advanced', lessons: 18, rating: 4.8, color: 'red', icon: '🔬' },
  { id: 6,    title: 'Creative Writing',          subject: 'Writing',                grade: 'Primary 6', level: 'Advanced', lessons: 12, rating: 4.6, color: 'cyan', icon: '✍️' },
  { id: 8,    title: 'French Basics',             subject: 'French',                 grade: 'Primary 3', level: 'Beginner', lessons: 16, rating: 4.7, color: 'green', icon: '🇫🇷' },
  { id: 9,    title: 'Our Environment',           subject: 'Environmental Studies',  grade: 'Primary 2', level: 'Beginner', lessons: 9, rating: 4.5, color: 'orange', icon: '🌱' },
  { id: 10,   title: 'History Heroes',            subject: 'History',                grade: 'Primary 6', level: 'Intermediate', lessons: 11, rating: 4.8, color: 'purple', icon: '🏛️' },
  { id: 11,   title: 'Art & Music Fun',           subject: 'Art',                    grade: 'Kindergarten', level: 'Beginner', lessons: 8, rating: 4.9, color: 'red', icon: '🎨' },
  { id: 12,   title: 'Health & Fitness',          subject: 'Health Education',       grade: 'Primary 4', level: 'Beginner', lessons: 10, rating: 4.6, color: 'cyan', icon: '💪' }
];

export const plans = [
  { id: 1, name: 'Monthly', price: 5, period: 'month', features: ['Full access to all subjects','AI Study Assistant','Games & quizzes','Downloadable worksheets'] },
  { id: 2, name: 'Quarterly', price: 12, period: 'quarter', features: ['Everything in Monthly','Live classes included','Parent progress reports','Priority support'] },
  { id: 3, name: 'Yearly', price: 40, period: 'year', popular: true, features: ['Everything in Quarterly','Verified certificates','2 teacher accounts','Offline learning','50% off (limited time)'] },
  { id: 4, name: 'Lifetime', price: 99, period: 'once', features: ['Everything in Yearly','Unlimited forever','All future content','5 family accounts','Lifetime support'] }
];
