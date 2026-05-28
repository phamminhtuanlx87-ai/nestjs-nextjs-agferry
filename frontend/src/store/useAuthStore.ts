"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Định nghĩa chi tiết từng quyền (Permission)
export enum UserPermission {
  // Quyền với Dự án (Projects)
  PROJECT_CREATE = "PROJECT_CREATE",
  PROJECT_UPDATE = "PROJECT_UPDATE",
  PROJECT_DELETE = "PROJECT_DELETE",
  PROJECT_VIEW = "PROJECT_VIEW",

  // Quyền với Người dùng (Users)
  USER_CREATE = "USER_CREATE",
  USER_UPDATE = "USER_UPDATE",
  USER_DELETE = "USER_DELETE",
  USER_VIEW = "USER_VIEW",
}
// Định nghĩa cấu trúc của User
export interface UserData {
  userName: string;
  fullName: string;
  email: string;
  role: string;
  permissions: string[]; // Thêm trường này để đi kèm với thông tin User
  isActive: boolean;
}

interface AuthState {
  user: UserData | null;
  token: string | null; // Thêm trường token riêng
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (userData: UserData, token: string, refreshToken: string) => void; // Nhận thêm tham số token và refreshToken
  logout: () => void;
  setUser: (userData: UserData) => void;
  hasPermission: (permissionValue: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
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
      setUser: (user) => set({ user }),
      hasPermission: (permissionValue) => {
        // Log này giúp bạn nhìn thấy cấu trúc thực tế của user.permissions trên tab Console trình duyệt
        const user = get().user;
        if (!user) return false;

        // 1. KIỂM TRA TRẠNG THÁI HOẠT ĐỘNG TRƯỚC (Ưu tiên số 1)
        if (user.isActive === false) return false;
        
        if (!user || !user.permissions) return false;
        const result = user.permissions.includes(permissionValue);
        return result;
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
