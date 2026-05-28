/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { alertService } from "@/utils/swal";
import {
  changePasswordService,
  ResetPasswordValues,
} from "@/services/authService";

interface ResetPasswordFormProps {
  isModal?: boolean; // Sử dụng như một Modal hoặc một trang độc lập
  onSuccess?: () => void; // Callback xử lý sau khi đổi thành công
}

export default function ResetPasswordForm({
  isModal = false,
  onSuccess,
}: ResetPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Theo dõi mật khẩu mới để làm điều kiện so khớp cho ô nhập lại
  const watchedNewPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      console.log(payload);
      // Giả lập gọi API đổi mật khẩu (Thay thế bằng hàm dịch vụ thực tế của bạn)
      await changePasswordService(payload);

      alertService.success("Thay đổi mật khẩu bảo mật thành công!");
      reset(); // Xóa sạch dữ liệu form sau khi thành công

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      alertService.error(
        "Có lỗi xảy ra, vui lòng kiểm tra lại mật khẩu hiện tại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`space-y-4 w-full ${isModal ? "" : "max-w-md mx-auto p-6 bg-white border border-slate-200/80 rounded-xl shadow-sm"}`}
    >
      {!isModal && (
        <div className="pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Cập nhật bảo mật
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để thay đổi.
          </p>
        </div>
      )}

      {/* 1. MẬT KHẨU HIỆN TẠI */}
      <div className="space-y-1">
        <Input
          label="Mật khẩu hiện tại"
          type="password"
          placeholder="••••••••"
          {...register("currentPassword", {
            required: "Vui lòng nhập mật khẩu hiện tại",
          })}
          error={errors.currentPassword?.message}
        />
      </div>

      {/* 2. MẬT KHẨU MỚI */}
      <div className="space-y-1 relative">
        <Input
          label="Mật khẩu mới"
          type={showNewPassword ? "text" : "password"}
          placeholder="Tối thiểu 6 ký tự"
          {...register("newPassword", {
            required: "Vui lòng nhập mật khẩu mới",
            minLength: {
              value: 6,
              message: "Mật khẩu mới phải có tối thiểu 6 ký tự",
            },
          })}
          error={errors.newPassword?.message}
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-3 top-8.5 text-slate-400 hover:text-slate-600 text-xs font-medium select-none"
        >
          {showNewPassword ? "Ẩn" : "Hiện"}
        </button>
      </div>

      {/* 3. NHẬP LẠI MẬT KHẨU MỚI */}
      <div className="space-y-1 relative">
        <Input
          label="Xác nhận mật khẩu mới"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="••••••••"
          {...register("confirmPassword", {
            required: "Vui lòng nhập lại mật khẩu mới",
            validate: (value) =>
              value === watchedNewPassword ||
              "Mật khẩu xác nhận không trùng khớp!",
          })}
          error={errors.confirmPassword?.message}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-8.5 text-slate-400 hover:text-slate-600 text-xs font-medium select-none"
        >
          {showConfirmPassword ? "Ẩn" : "Hiện"}
        </button>
      </div>

      {/* KHỐI HÀNH ĐỘNG ĐIỀU KHIỂN */}
      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 shadow-md"
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận đổi"}
        </Button>
      </div>
    </form>
  );
}
