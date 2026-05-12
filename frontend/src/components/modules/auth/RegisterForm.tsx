"use client";

import { authRegister, RegisterFormData } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Khai báo hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true); // Bắt đầu load
    try {
      // Giả sử NestJS của Tuấn chạy ở port 3000
      const response = await authRegister(data);

      if (response.data) {
        toast.success("Đăng ký thành công!");
        setTimeout(() => {
          // Chuyển hướng sang trang quản lý phà
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      toast.error("Đăng ký thất bại! Vui lòng thử lại.");
      console.error("Register error:", error);
    } finally {
      setIsLoading(false); // Kết thúc load
    }
  };

  return (
    <>
      <div className="card-login flex items-center justify-center w-full max-w-5xl mx-auto px-4 mt-5">
        <div className="banerright bg-[#f3f4f6]">
          <div className="sm:w-111.75 w-83.75 bg-white card-soft">
            <h2 className="text-xl font-bold mb-2 text-shadow-sm">
              Tạo tài khoản mới
            </h2>

            <form
              method="post"
              className="flex flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
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
                placeholder="Nhập mật khẩu..."
              />
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message as string}
                </span>
              )}
              <Input
                label="Họ và tên"
                {...register("fullName", {
                  required: "Vui lòng nhập họ và tên",
                })}
                placeholder="Nhập họ và tên..."
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs">
                  {errors.fullName.message as string}
                </span>
              )}
              <Input
                label="Email"
                type="email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                })}
                placeholder="Nhập email..."
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message as string}
                </span>
              )}

              <Button
                type="submit"
                className={`btn-login btn-primary min-w-60 mx-auto btn-elevated mt-3 ${isLoading ? "cursor-not-allowed disabled:" : ""}`}
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
