import axios from "axios";
import { store } from "@/redux/store";
import { refreshTokenSuccess, refreshTokenFailure, logout } from "@/redux/slices/auth-slice";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;

let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isLoginRequest = originalRequest.url.includes("/users/login");
    const isRefreshTokenRequest = originalRequest.url.includes("/users/refresh-token")

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshTokenRequest) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((accessToken: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("api.ts - Refreshing token...");
        const response = await axios.post(`${baseUrl}/users/refresh-token`, { withCredentials: true });

        const newAccessToken = response.data.accessToken;
        const user = response.data.user;

        store.dispatch(refreshTokenSuccess({ accessToken: newAccessToken, user , expiresIn : response.data.expiresIn }));

        processQueue(null, newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(refreshTokenFailure());
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api;
