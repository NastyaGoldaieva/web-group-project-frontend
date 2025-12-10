import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAccess = () => localStorage.getItem('access_token');
const getRefresh = () => localStorage.getItem('refresh_token');

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};
    const token = getAccess();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    if (!error.response) return Promise.reject(error);

    // Only attempt refresh on 401
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefresh();
    if (!refreshToken) {
      // nothing to do: no refresh token
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // queue calls that happen while refreshing
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise(async (resolve, reject) => {
      try {
        const resp = await axios.post(
          'http://127.0.0.1:8000/api/auth/token/refresh/',
          { refresh: refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const newAccess = resp.data.access;
        localStorage.setItem('access_token', newAccess);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccess;
        processQueue(null, newAccess);
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
        resolve(api(originalRequest));
      } catch (err) {
        processQueue(err, null);
        // clear storage on refresh failure
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');
        reject(err);
      } finally {
        isRefreshing = false;
      }
    });
  }
);

export default api;