/**
 * KERTAS KATA - Client API Bridge
 * Menghubungkan Frontend Next.js ke Express Backend (Port 5000 / Proxy)
 */

const API_BASE = '/api';

export const TOKEN_KEY = 'kertaskata_token';
export const USER_KEY = 'kertaskata_user';

export async function fetchApi(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`API Error [${endpoint}]:`, err.message);
    return { success: false, message: err.message || 'Terjadi gangguan koneksi ke server.' };
  }
}

export const api = {
  get: (endpoint) => fetchApi(endpoint, { method: 'GET' }),
  post: (endpoint, body) => fetchApi(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => fetchApi(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => fetchApi(endpoint, { method: 'DELETE' }),

  // Auth Endpoints
  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    google: (payload) => api.post('/auth/google', payload),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
  },

  // User Profile
  user: {
    updateProfile: (data) => api.put('/user/profile', data),
    changePassword: (data) => api.post('/user/change-password', data),
  },

  // Articles Endpoints
  articles: {
    getPublic: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api.get(`/articles/public?${q}`);
    },
    getBySlug: (slug) => api.get(`/articles/public/read/${slug}`),
    getMy: (status = 'all') => api.get(`/articles/my?status=${status}`),
    getById: (id) => api.get(`/articles/my/${id}`),
    save: (articleData) => api.post('/articles/save', articleData),
    submitReview: (id) => api.post(`/articles/${id}/submit`),
  },

  // Admin Review Endpoints
  admin: {
    getOverview: () => api.get('/admin/reviews/overview'),
    getQueue: (status = 'in_review') => api.get(`/admin/reviews/queue?status=${status}`),
    runAICheck: (id) => api.post(`/admin/reviews/${id}/ai-check`),
    addComment: (id, comment) => api.post(`/admin/reviews/${id}/comment`, { comment }),
    decide: (id, decision, notes) => api.post(`/admin/reviews/${id}/decide`, { decision, notes }),
    getMembers: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api.get(`/user/members?${q}`);
    },
    updateMemberStatus: (id, data) => api.patch(`/user/members/${id}/status`, data),
  },

  // E-Learning
  elearning: {
    getModules: () => api.get('/elearning/modules'),
    getClassroom: (id) => api.get(`/elearning/modules/${id}`),
    submitQuiz: (moduleId, answers) => api.post(`/elearning/modules/${moduleId}/quiz`, { answers }),
    createModule: (data) => api.post('/elearning/modules', data),
    updateModule: (id, data) => api.put(`/elearning/modules/${id}`, data),
    deleteModule: (id) => api.delete(`/elearning/modules/${id}`),
  },

  // Perpustakaan E-Book
  library: {
    getEbooks: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api.get(`/library/ebooks?${q}`);
    },
    createEbook: (data) => api.post('/library/ebooks', data),
    updateEbook: (id, data) => api.put(`/library/ebooks/${id}`, data),
    deleteEbook: (id) => api.delete(`/library/ebooks/${id}`),
  },

  // Komunitas
  community: {
    getThreads: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return api.get(`/community/threads?${q}`);
    },
    createThread: (threadData) => api.post('/community/threads', threadData),
  },

  // Cetak & ISBN
  print: {
    getOrders: () => api.get('/print/my-orders'),
    createOrder: (orderData) => api.post('/print/orders', orderData),
  },
};

export default api;
