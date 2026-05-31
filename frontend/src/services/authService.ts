import { IUser } from "@/components/modules/nhan-vien/UserTable";
import api from "@/lib/axios";

export interface LoginFormData {
  userName: string;
  password: string;
}

export async function authLogin({ userName, password }: LoginFormData) {
  return await api.post("/auth/login", {
    userName: userName,
    password: password,
  });
}

export interface RegisterFormData {
  userName: string;
  password: string;
  fullName: string;
  email: string;
}
export async function authRegister(userData: RegisterFormData) {
  return await api.post("/auth/register", userData);
}

export interface Permission {
  index: number;
  value: string;
}
export interface Department {
  id: string;
  name: string;
}
export interface Positions {
  id: string;
  name: string;
}
export interface MeData {
  id: string;
  userName: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: Permission[];
  department: Department;
  positions: Positions;
}

interface BackendResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
export async function getMe(): Promise<MeData> {
  const response = await api.get<BackendResponse<MeData>>("/auth/me");
  return response.data.data; // Trả thẳng object user chứa role và permissions
}

export interface MeUpdateFormData {
  fullName: string;
}

export interface MeFormValues {
  fullName: string;
  userName: string;
  email: string;
  department: string;
  positions: string;
  isActive?: boolean;
}

export interface MeRequest {
  fullName: string;
  email: string;
  department: {
    id: string;
    name: string;
  };
  positions: {
    id: string;
    name: string;
  };
}

export async function meUpdate(userData: MeRequest) {
  return await api.patch<BackendResponse<MeRequest>>("/auth/me", userData);
}

export interface ResetPasswordValues {
  currentPassword?: string; // Dùng nếu đổi mật khẩu khi đang đăng nhập
  newPassword: string;
  confirmPassword: string;
}

export async function changePasswordService(userData: ResetPasswordValues) {
  return await api.patch<BackendResponse<ResetPasswordValues>>(
    "/auth/me/reset",
    userData,
  );
}

export async function getAllUsers(
  mode: "all" | "active" | "inactive",
): Promise<IUser[]> {
  const response = await api.get<BackendResponse<IUser[]>>(`/auth/${mode}`);
  return response.data.data; // Trả thẳng object user chứa role và permissions
}

export async function toggleActive(id: string): Promise<IUser[]> {
  const response = await api.patch<BackendResponse<IUser[]>>(
    `/auth/${id}/toggle`,
  );
  return response.data.data; // Trả thẳng object user chứa role và permissions
}
