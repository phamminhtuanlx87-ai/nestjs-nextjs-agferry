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
};


export interface RegisterFormData {
  userName: string;
  password: string;
  fullName: string;
  email: string;
}
export async function authRegister(userData: RegisterFormData) {
  return await api.post("/auth/register", userData);
};

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
  userName: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  permissions: Permission[];
  department:Department;
  positions:Positions;
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
export async function meUpdata(userData: RegisterFormData) {
  return await api.post("/auth/register", userData);
}