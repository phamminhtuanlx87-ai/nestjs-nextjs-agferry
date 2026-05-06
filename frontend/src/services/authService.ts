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