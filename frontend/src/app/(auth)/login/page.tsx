"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import banner_left from "@/assets/images/banner_left.png";
import googleIcon from "@/assets/icons/googleicon.svg";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/useAuthStore";
import { authLogin, LoginFormData } from "@/services/authService";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { alertService } from "@/utils/swal";

export default function LoginPage() {
  const router = useRouter();
  const { login , user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Khai báo hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  // Nếu đã có user, tự động chuyển hướng sang trang quản lý phà
  // 1. Đợi Zustand đọc xong localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  // 2. Nếu đã nạp xong và có user, đẩy đi ngay
  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/cong-trinh");
    }
  }, [isHydrated, user, router]);

  // 3. QUAN TRỌNG: Nếu chưa nạp xong dữ liệu HOẶC đã có user, trả về null
  // Điều này ngăn việc hiện Form Login "nháy" qua mắt người dùng
  if (!isHydrated) {
    return <LoadingScreen />;
  }
  // TRƯỜNG HỢP 2: Đã nạp xong và phát hiện CÓ user -> Hiện Loading (chờ useEffect đẩy đi)
  if (isHydrated && user) {
    return <LoadingScreen />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true); // Bắt đầu load
    try {
      // Giả sử NestJS của Tuấn chạy ở port 3000
      const response = await authLogin({
        userName: data.userName,
        password: data.password,
      });
     
      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;
        login(user, accessToken, refreshToken); // Lưu vào Zustand
        alertService.success("Đăng nhập thành công!");
        setTimeout(() => {
          // Chuyển hướng sang trang quản lý phà
          router.replace("/tong-quan");
        }, 1500);
      }
    } catch (error) {
      alertService.error("Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Kết thúc load
    }
  };

  return (
    <>
      <main className="flex-1 flex justify-center">
        <div className="card-login flex items-center justify-center w-full max-w-5xl mx-auto px-4">
          <div className="banerleft w-130 h-100 bg-no-repeat bg-contain bg-center md:flex md:flex-col items-center justify-center text-center hidden">
            <Image
              src={banner_left}
              alt="Cty Cổ phần Phà An Giang"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div className="banerright bg-[#f3f4f6]">
            <div className="sm:w-111.75 w-83.75 bg-white card-soft">
              <h2 className="text-xl font-bold mb-2 text-shadow-sm">
                Đăng nhập
              </h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <Input
                  label="Tên đăng nhập"
                  {...register("userName", {
                    required: "Vui lòng nhập tài khoản",
                  })}
                  placeholder="Nhập tài khoản..."
                />
                {errors.userName && (
                  <span className="text-red-500 text-xs">
                    {errors.userName.message as string}
                  </span>
                )}

                <Input
                  label="Mật khẩu"
                  type="password"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                  })}
                  placeholder="********"
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message as string}
                  </span>
                )}
                <Button
                  type="submit"
                  className="btn-login btn-primary min-w-60 mx-auto btn-elevated mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập hệ thống"}
                </Button>
                <button
                  type="button"
                  className="btn-login-google btn-secondary text-gray-700 min-w-60 flex justify-center items-center gap-3 
                mx-auto btn-elevated my-2 mt-3"
                >
                  <Image
                    src={googleIcon}
                    alt="Google icon"
                    className="w-5 h-5"
                    loading="eager"
                  />
                  Đăng nhập với Google
                </button>

                <p className="text-center mt-3">
                  Chưa có tài khoản?
                  <Link
                    href="/register"
                    className="text-blue-600 font-medium ml-1 hover:text-accent hover:cursor-pointer hover:underline"
                  >
                    Đăng ký
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
