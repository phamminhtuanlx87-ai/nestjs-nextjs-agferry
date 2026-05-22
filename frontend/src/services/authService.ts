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

export interface GetMeData {
  userName: string;
  fullName: string;
  email: string;
  role: string;
  permissions: Permission[];
}

interface BackendResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}
export async function getMe(): Promise<GetMeData> {
  const response = await api.get<BackendResponse<GetMeData>>("/auth/me");
  return response.data.data; // Trả thẳng object user chứa role và permissions
}