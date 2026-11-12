import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Tự động đính kèm Bearer token từ LocalStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      // Đọc auth token từ localStorage (ưu tiên zustand store 'fashion_auth')
      let token: string | null = null;
      try {
        const storedAuth = localStorage.getItem("fashion_auth");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          token = parsed?.state?.token || null;
        }
      } catch {
        // Fallback đọc token trực tiếp
        token = localStorage.getItem("token");
      }

      if (!token) {
        token = localStorage.getItem("token") || localStorage.getItem("auth_token");
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Chuẩn hoá kết quả và xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("fashion_auth");
        }
      } else if (status === 422 && data.errors) {
        const firstError = Object.values(data.errors)[0]?.[0];
        if (firstError) {
          toast.error(firstError);
        }
      } else if (status >= 500) {
        toast.error("Máy chủ đang bận, vui lòng thử lại sau!");
      }
    } else if (error.request) {
      // Lỗi mạng hoặc CORS
      console.warn("[Axios Network Error]:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

