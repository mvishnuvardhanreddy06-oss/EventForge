import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Bearer token to all outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventforge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize response data and intercept global errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const res = error.response;
    const message = res?.data?.message || error.message || 'An unexpected error occurred';
    const customError = new Error(message);
    customError.response = res;
    customError.status = res?.status;
    return Promise.reject(customError);
  }
);

export default api;
