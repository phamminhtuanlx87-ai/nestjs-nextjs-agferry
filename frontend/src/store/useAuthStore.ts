import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
// Định nghĩa cấu trúc của User
interface User {
  id: string;
  email: string;
  fullName?: string;
  // Thêm các trường khác tùy vào API của bạn
}

interface AuthState {
  user: User | null;
  token: string | null; // Thêm trường token riêng
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string, refreshToken: string) => void; // Nhận thêm tham số token và refreshToken
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null, // Khởi tạo giá trị null
      isAuthenticated: false,
      login: (user, token, refreshToken) => {
        set({ user, token, refreshToken, isAuthenticated: true });
      },
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        refreshToken: state.refreshToken, // Cho phép lưu cả Refresh Token
      }),
    },
  ),
);
