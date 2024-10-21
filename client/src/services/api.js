// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL:'http://127.0.0.1:5555/', 
});
// Add a request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error); // Log the entire error
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'; // Redirect to login on 401
    }
    return Promise.reject(error);
  }
);

// Set default headers if needed
api.defaults.headers.common['Content-Type'] = 'application/json';
export default api;
