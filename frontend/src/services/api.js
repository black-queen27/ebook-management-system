/**
 * Centralized API Service for communicating with Flask Backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  // Authentication
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  // User Profile
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return handleResponse(response);
  },

  updateUserProfile: async (userId, profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // Books
  getBooks: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.append('q', params.q);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.sort) query.append('sort', params.sort);
    if (params.limit) query.append('limit', params.limit);
    if (params.offset) query.append('offset', params.offset);

    const url = `${API_BASE_URL}/books${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  getBookById: async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/books/categories`);
    return handleResponse(response);
  },

  // User Library
  getUserLibrary: async (userId, status = '') => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    const response = await fetch(`${API_BASE_URL}/library/${userId}${query}`);
    return handleResponse(response);
  },

  addToLibrary: async (userId, bookId, readingStatus = 'Currently Reading', progressPercent = 0) => {
    const response = await fetch(`${API_BASE_URL}/library`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
        reading_status: readingStatus,
        progress_percent: progressPercent,
      }),
    });
    return handleResponse(response);
  },

  removeFromLibrary: async (userId, bookId) => {
    const response = await fetch(`${API_BASE_URL}/library/${userId}/${bookId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  updateReadingStatus: async (userId, bookId, readingStatus, progressPercent) => {
    const response = await fetch(`${API_BASE_URL}/library/${userId}/${bookId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reading_status: readingStatus,
        progress_percent: progressPercent,
      }),
    });
    return handleResponse(response);
  },

  // Dashboard
  getDashboardData: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`);
    return handleResponse(response);
  },

  // Health
  checkHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};
