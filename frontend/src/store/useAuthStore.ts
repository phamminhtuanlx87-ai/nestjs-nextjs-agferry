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
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void; // Nhận thêm tham số token
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }), // Chỉ lưu user và isAuthenticated, không lưu token
    }
  )
);
