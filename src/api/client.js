import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // cookies bhi bhejo (same-domain par kaam karta hai)
});

// ✅ REQUEST INTERCEPTOR — har request mein Authorization header add karo
// Yeh cookie ke saath ek backup hai. Agar cookie cross-domain block ho,
// Authorization header se token poch jayega aur 401 nahi aayega.
apiClient.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('smartbite_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.accessToken) {
          config.headers['Authorization'] = `Bearer ${user.accessToken}`;
        }
      }
    } catch (e) {
      // localStorage parse error — ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR — 401 par storage clear karo
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired ya invalid — localStorage clear karo
      localStorage.removeItem('smartbite_user');
      localStorage.removeItem('mfc_user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

