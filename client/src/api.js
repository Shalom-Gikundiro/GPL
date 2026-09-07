const API = '/api';

export function getToken() {
  return localStorage.getItem('gpl_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('gpl_token', token);
  else localStorage.removeItem('gpl_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
};

export const courseApi = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('/courses' + (qs ? `?${qs}` : ''));
  },
  get: (id) => request(`/courses/${id}`),
  enroll: (id) => request(`/courses/${id}/enroll`, { method: 'POST' }),
  mine: () => request('/courses/mine/enrolled'),
  subjects: () => request('/courses/subjects'),
  grades: () => request('/courses/grades'),
};

export const miscApi = {
  plans: () => request('/plans'),
  chat: (message) => request('/chat', { method: 'POST', body: JSON.stringify({ message }) }),
  contact: (payload) => request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  newsletter: (email) => request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) }),
};

export const adminApi = {
  stats: () => request('/admin/stats'),
  users: () => request('/admin/users'),
  courses: () => request('/admin/courses'),
  enrollments: () => request('/admin/enrollments'),
  reports: () => request('/admin/reports'),
  messages: () => request('/admin/messages'),
  newsletter: () => request('/admin/newsletter'),
  settings: () => request('/admin/settings'),
  updateSettings: (data) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
};

export const teacherApi = {
  myCourses: () => request('/teacher/my-courses'),
  students: () => request('/teacher/students'),
  stats: () => request('/teacher/stats'),
  assignments: () => request('/teacher/assignments'),
  grading: () => request('/teacher/grading'),
  schedule: () => request('/teacher/schedule'),
  messages: () => request('/teacher/messages'),
  resources: () => request('/teacher/resources'),
  reports: () => request('/teacher/reports'),
};

export const parentApi = {
  children: () => request('/parent/children'),
  childProgress: (childId) => request(`/parent/child-progress/${childId}`),
  progress: () => request('/parent/progress'),
  attendance: () => request('/parent/attendance'),
  grades: () => request('/parent/grades'),
  messages: () => request('/parent/messages'),
  events: () => request('/parent/events'),
  billing: () => request('/parent/billing'),
  settings: () => request('/parent/settings'),
  updateSettings: (data) => request('/parent/settings', { method: 'PUT', body: JSON.stringify(data) }),
  linkChild: (payload) => request('/parent/link-child', { method: 'POST', body: JSON.stringify(payload) }),
  unlinkChild: (childId) => request(`/parent/unlink-child/${childId}`, { method: 'POST' }),
};

export const studentApi = {
  progress: () => request('/student/progress'),
  achievements: () => request('/student/achievements'),
  leaderboard: () => request('/student/leaderboard'),
  notifications: () => request('/student/notifications'),
  assignments: () => request('/student/assignments'),
  exams: () => request('/student/exams'),
  certificates: () => request('/student/certificates'),
  lessons: () => request('/student/lessons'),
  linkParent: (payload) => request('/student/link-parent', { method: 'POST', body: JSON.stringify(payload) }),
};

export const messageApi = {
  users: () => request('/messages/users'),
  inbox: () => request('/messages/inbox'),
  sent: () => request('/messages/sent'),
  send: (payload) => request('/messages/send', { method: 'POST', body: JSON.stringify(payload) }),
  markRead: (id) => request(`/messages/${id}/read`, { method: 'PUT' }),
};

export const uploadApi = {
  upload: (formData) => {
    const token = getToken();
    return fetch(API + '/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    }).then(res => res.json().catch(() => ({}))).then(data => {
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      return data;
    });
  },
  library: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('/library' + (qs ? `?${qs}` : ''));
  },
  getFile: (id) => request(`/library/${id}`),
  deleteFile: (id) => request(`/library/${id}`, { method: 'DELETE' }),
};

export const liveApi = {
  create: (payload) => request('/live-sessions', { method: 'POST', body: JSON.stringify(payload) }),
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('/live-sessions' + (qs ? `?${qs}` : ''));
  },
  get: (id) => request(`/live-sessions/${id}`),
  start: (id) => request(`/live-sessions/${id}/start`, { method: 'PUT' }),
  end: (id) => request(`/live-sessions/${id}/end`, { method: 'PUT' }),
  join: (id) => request(`/live-sessions/${id}/join`, { method: 'POST' }),
  attendees: (id) => request(`/live-sessions/${id}/attendees`),
};
