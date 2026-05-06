import axios from "axios";

const api = axios.create({
  // Địa chỉ gốc của backend NestJS
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // 1. Lấy token từ nơi Tuấn lưu trữ (ví dụ localStorage)
    const token = localStorage.getItem("access_token");

    // 2. Nếu có token, đính kèm vào Header Authorization
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. Phải return config để request tiếp tục lên đường
    return config;
  },
  (error) => {
    // Xử lý lỗi trước khi request được gửi đi (thường ít gặp)
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
     // CHỈ chuyển hướng nếu người dùng KHÔNG ở trang login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
export default api;
