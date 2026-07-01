// A single Axios instance used for all API calls.
// It automatically attaches the JWT token to every request.

import axios from "axios";

const api = axios.create({
  // In production, set VITE_API_URL in the frontend .env file.
  // Falls back to the local backend during development.
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the saved token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
