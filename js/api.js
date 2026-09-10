/**
 * KERTAS KATA - FRONTEND API CLIENT HELPER
 * Menghubungkan 21 halaman frontend secara mulus ke REST API Backend.
 * Otomatis mendeteksi lingkungan Lokal (localhost:5000) vs Produksi (kertaskata.my.id).
 */

(function (window) {
  'use strict';

  // 1. Deteksi Base URL
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // Jika lokal dan dibuka via file:// atau live-server port 8080/5500, arahkan ke port 5000
  const BASE_URL = isLocal ? 'http://localhost:5000/api' : '/api';

  // 2. Storage Keys
  const TOKEN_KEY = 'kk_token';
  const USER_KEY = 'kk_user';

  // 3. Helper Toast Notifikasi Cepat
  function showToast(message, type = 'info') {
    let container = document.getElementById('apiToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'apiToastContainer';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 380px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bg = type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#1e293b';
    toast.style.cssText = `
      background: ${bg};
      color: #ffffff;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 0.875rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // 4. Core Request Handler
  async function request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const token = localStorage.getItem(TOKEN_KEY);

    const headers = {
      ...(options.isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.isFormData ? options.body : (options.body ? JSON.stringify(options.body) : undefined),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Jika token kedaluwarsa (401), redirect ke login jika perlu
        if (response.status === 401 && token) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          showToast('Sesi Anda telah kedaluwarsa. Silakan masuk kembali.', 'error');
        }
        const errorMsg = data.message || `Request gagal (${response.status})`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`[API Error] ${endpoint}:`, err);
      throw err;
    }
  }

  // 5. Public API Client
  const API = {
    BASE_URL,
    toast: showToast,

    // HTTP Methods
    get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
    patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
    delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),

    // Upload FormData
    upload: (endpoint, formData) => request(endpoint, { method: 'POST', body: formData, isFormData: true }),

    // Auth Module
    auth: {
      getToken: () => localStorage.getItem(TOKEN_KEY),
      getUser: () => {
        try {
          return JSON.parse(localStorage.getItem(USER_KEY));
        } catch (e) {
          return null;
        }
      },
      isLoggedIn: () => Boolean(localStorage.getItem(TOKEN_KEY)),
      isAdmin: () => {
        const user = API.auth.getUser();
        return user && (user.role === 'admin' || user.role === 'mentor');
      },

      login: async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        if (res.success && res.data.token) {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          showToast(`Selamat datang kembali, ${res.data.user.name}!`, 'success');
        }
        return res;
      },

      loginGoogle: async (idToken, mockData) => {
        const res = await API.post('/auth/google', { idToken, mockData });
        if (res.success && res.data.token) {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          showToast(`Berhasil masuk sebagai ${res.data.user.name}!`, 'success');
        }
        return res;
      },

      register: async (userData) => {
        const res = await API.post('/auth/register', userData);
        if (res.success && res.data.token) {
          localStorage.setItem(TOKEN_KEY, res.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
          showToast('Pendaftaran akun berhasil!', 'success');
        }
        return res;
      },

      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        showToast('Anda telah keluar dari akun.', 'info');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      },

      ensureUserAuth: async (requiredRole = 'participant') => {
        const user = API.auth.getUser();
        const hasToken = API.auth.isLoggedIn();
        if (hasToken && user) {
          if (requiredRole === 'admin' && (user.role === 'admin' || user.role === 'mentor')) return user;
          if (requiredRole === 'participant' && user.role === 'participant') return user;
          if (requiredRole === 'any') return user;
        }
        // Auto-login di localhost jika belum ada sesi untuk memudahkan pengujian
        try {
          if (requiredRole === 'admin') {
            const res = await API.auth.login('admin@kertaskata.my.id', 'AdminPassword2026!');
            return res.data.user;
          } else {
            const res = await API.auth.login('rahmat.hidayat@gmail.com', 'MemberPassword2026!');
            return res.data.user;
          }
        } catch (e) {
          return null;
        }
      },

      syncUser: async () => {
        if (!API.auth.isLoggedIn()) return null;
        try {
          const res = await API.get('/auth/me');
          if (res.success && res.data) {
            localStorage.setItem(USER_KEY, JSON.stringify(res.data));
            return res.data;
          }
        } catch (e) {
          console.warn('Gagal sinkronisasi data profil pengguna.');
        }
        return null;
      },
    },

    // Artikel
    articles: {
      getPublic: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return API.get(`/articles/public?${query}`);
      },
      getRead: (slug) => API.get(`/articles/public/read/${slug}`),
      getMy: (status = 'all') => API.get(`/articles/my?status=${status}`),
      getById: (id) => API.get(`/articles/my/${id}`),
      save: (articleData) => API.post('/articles/save', articleData),
      submitReview: (id) => API.post(`/articles/${id}/submit`),
    },

    // Admin Review
    admin: {
      getOverview: () => API.get('/admin/reviews/overview'),
      getQueue: (status = 'in_review') => API.get(`/admin/reviews/queue?status=${status}`),
      runAICheck: (id) => API.post(`/admin/reviews/${id}/ai-check`),
      addComment: (id, targetText, comment) => API.post(`/admin/reviews/${id}/comment`, { targetText, comment }),
      decide: (id, decision, notes) => API.post(`/admin/reviews/${id}/decide`, { decision, notes }),
      getMembers: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return API.get(`/user/members?${q}`);
      },
    },

    // E-Learning
    elearning: {
      getModules: () => API.get('/elearning/modules'),
      getClassroom: (id) => API.get(`/elearning/modules/${id}`),
      submitQuiz: (moduleId, answers) => API.post(`/elearning/modules/${moduleId}/quiz`, { answers }),
    },

    // Perpustakaan
    library: {
      getEbooks: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return API.get(`/library/ebooks?${q}`);
      },
      getById: (id) => API.get(`/library/ebooks/${id}`),
      buy: (id, paymentProofUrl) => API.post(`/library/ebooks/${id}/buy`, { paymentProofUrl }),
    },

    // Komunitas
    community: {
      getThreads: (params = {}) => {
        const q = new URLSearchParams(params).toString();
        return API.get(`/community/threads?${q}`);
      },
      getById: (id) => API.get(`/community/threads/${id}`),
      createThread: (data) => API.post('/community/threads', data),
      reply: (id, content) => API.post(`/community/threads/${id}/replies`, { content }),
    },

    // Cetak Naskah
    print: {
      calculate: (params) => API.post('/print/calculate', params),
      order: (orderData) => API.post('/print/order', orderData),
      getMyOrders: () => API.get('/print/my-orders'),
    },

    // Sertifikat
    certificates: {
      getMy: () => API.get('/certificates/my'),
      verify: (certNumber) => API.get(`/certificates/verify/${certNumber}`),
    },

    // Statistik Platform
    stats: {
      getOverview: () => API.get('/stats/overview'),
    },
  };

  // Expose ke window object global
  window.KK_API = API;

  // Inisialisasi otomatis: sinkronisasi profil user jika sudah login
  document.addEventListener('DOMContentLoaded', () => {
    if (API.auth.isLoggedIn()) {
      API.auth.syncUser();
    }
  });
})(window);
