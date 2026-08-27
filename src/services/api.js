import axios from 'axios';

const api = axios.create({
  baseURL: 'https://billtable-backend.onrender.com',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request comes back 401, the stored token is no good — clear it so
// nothing keeps resending a dead token. This does NOT force-navigate
// anywhere: the screen that made the call is responsible for showing its
// own error (Sign Up only happens where the Flow actually puts it, at the
// start — never as a surprise mid-flow redirect).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try { localStorage.removeItem('token'); } catch { /* ignore */ }
    }
    return Promise.reject(error);
  }
);

export default api;
