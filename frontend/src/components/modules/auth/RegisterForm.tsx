"use client";

import { authRegister, RegisterFormData } from "@/services/authService";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import axios from "axios";
import { alertService } from "@/utils/swal";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // Tạo thêm 1 state ở đầu Component để lưu thời gian đếm ngược (nếu có)
  const [cooldownTime, setCooldownTime] = useState<number>(0);
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

      if (axios.isAxiosError(error) && error.response?.status === 429) {
        // 1. Bắn thông báo cảnh cáo nghiêm túc
        alertService.error(
          "Hệ thống phát hiện hành vi spam dữ liệu liên tục! Bạn bị tạm khóa nút gửi trong 5 phút.",
        );

        // 2. Kích hoạt trạng thái khóa nút bấm
        setIsLoading(true);
        setCooldownTime(300); // 300 giây = 5 phút

        // 3. Chạy bộ đếm ngược hiển thị ra nút bấm
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLoading(false); // Mở khóa nút khi hết giờ
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return; // Thoát hàm, không chạy xuống finally
      }
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
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="min-w-50 mx-auto btn-elevated mt-3"
                  onClick={() => router.push("/login")}
                >
                  Quay lại
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="min-w-50 mx-auto btn-elevated mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
                  <br />
                  {cooldownTime > 0
                    ? `Vui lòng đợi (${Math.floor(cooldownTime / 60)}p:${cooldownTime % 60}s)`
                    : ""}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
