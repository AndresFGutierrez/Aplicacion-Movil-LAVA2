import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Storage wrapper: usa AsyncStorage si está disponible (React Native),
// o localStorage en entornos web.
const storageAvailable = (() => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch (e) {
    return false;
  }
})();

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (storageAvailable) return Promise.resolve(localStorage.getItem(key));
    return Promise.resolve(null);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (storageAvailable) return Promise.resolve(localStorage.setItem(key, value));
    return Promise.resolve();
  },
  async removeItem(key: string): Promise<void> {
    if (storageAvailable) return Promise.resolve(localStorage.removeItem(key));
    return Promise.resolve();
  },
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export interface ApiResponse<T = any> {
  success: boolean;
  mensaje?: string;
  data?: T;
}

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (err: any) => void; config: AxiosRequestConfig }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token && p.config.headers) p.config.headers['Authorization'] = `Bearer ${token}`;
      p.resolve(p.config);
    }
  });

  failedQueue = [];
};

const VITE_API_URL = 'http://localhost:3000';

const api: AxiosInstance = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await storage.getItem(ACCESS_TOKEN_KEY);
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        }).then((cfg: any) => api.request(cfg));
      }

      isRefreshing = true;

      try {
        const refreshToken = await storage.getItem(REFRESH_TOKEN_KEY);
        const resp = await axios.post(
          `${api.defaults.baseURL}/api/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccessToken = resp.data?.data?.accessToken;
        if (newAccessToken) {
          await storage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        }

        processQueue(null, newAccessToken);
        return api.request({ ...originalRequest, headers: { ...(originalRequest.headers || {}), Authorization: `Bearer ${newAccessToken}` } });
      } catch (err) {
        processQueue(err, null);
        await storage.removeItem(ACCESS_TOKEN_KEY);
        await storage.removeItem(REFRESH_TOKEN_KEY);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string | null) => {
  if (token) storage.setItem(ACCESS_TOKEN_KEY, token);
  else storage.removeItem(ACCESS_TOKEN_KEY);
};

export const setRefreshToken = (token: string | null) => {
  if (token) storage.setItem(REFRESH_TOKEN_KEY, token);
  else storage.removeItem(REFRESH_TOKEN_KEY);
};

export default api;
