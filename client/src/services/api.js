// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5555', // Adjust the base URL as needed
});

export default api;
