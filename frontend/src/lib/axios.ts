import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 429) {
      // Nếu NestJS trả về thông báo mặc định tiếng Anh, ta tự đè lại bằng câu tiếng Việt dễ hiểu
      if (
        !error.response.data.message ||
        error.response.data.message.includes("Throttler")
      ) {
        error.response.data.message =
          "Thao tác quá nhanh, vui lòng thử lại sau!";
      }

      // Chỉ ném lỗi ra (Reject) để file Form tự bắt lấy thông báo này hiển thị
      return Promise.reject(error);
    }
    // QUAN TRỌNG: Nếu API refresh cũng bị 401 thì phải logout ngay, không retry nữa
    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Lấy Base URL từ biến môi trường
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        // Dùng axios gốc để tránh bị interceptor này bắt lại
        const res = await axios.post(
          `${baseUrl}/auth/refresh` || "http://localhost:3000/api/auth/refresh",
          {
            refreshToken: refreshToken,
          },
        );
        const { accessToken, refreshToken: newRefreshToken } = res.data;
        const currentUser = useAuthStore.getState().user;

        if (currentUser && accessToken) {
          // 1. Cập nhật Store
          useAuthStore
            .getState()
            .login(currentUser, accessToken, newRefreshToken || refreshToken);

          // 2. QUAN TRỌNG: Gán lại token mới vào Header của request ĐANG BỊ LỖI
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          // 3. Thực hiện lại request đó với instance axios GỐC
          // (Dùng api(originalRequest) đôi khi bị dính cấu hình cũ)
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Khi refresh thất bại (hết hạn cả 2 token)
        useAuthStore.getState().logout();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
