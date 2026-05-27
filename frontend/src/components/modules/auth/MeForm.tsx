"use client";

import React, { useState } from "react";
import { Guard } from "@/components/common/Guard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { UserPermission } from "@/store/useAuthStore";
import { DEPARTMENTS, getInitials } from "@/utils/userHelpers";
import { useMeForm } from "@/hooks/useMeForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function MeForm() {
  // Triển khai custom hook đã tách toàn bộ logic
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    isSubmitting,
    cooldownTime,
    meData,
    watchedFullName,
    watchedEmail,
    availablePositions,
    currentDeptLabel,
    currentPositionLabel,
  } = useMeForm();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 font-sans space-y-6">
      {/* TIÊU ĐỀ TRANG */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Cài đặt tài khoản
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin hồ sơ và cấu hình bảo mật cá nhân.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsPasswordModalOpen(true)}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          🔒 Đổi mật khẩu
        </Button>
      </div>

      {/* KHỐI LAYOUT CHÍNH */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* PHẦN TRÁI: AVATAR ĐỊNH DANH (Đã sửa lỗi trùng lặp thẻ lồng nhau) */}
        <div className="md:col-span-4 bg-slate-50/80 p-6 md:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200/60 min-w-0 w-full overflow-hidden">
          <div className="relative mb-5 shrink-0">
            <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md ring-4 ring-white select-none">
              {isLoading ? (
                <span className="text-sm animate-pulse">...</span>
              ) : (
                getInitials(watchedFullName)
              )}
            </div>
          </div>

          <div className="space-y-2 w-full max-w-full px-2 min-w-0">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight wrap-break-word whitespace-pre-wrap block w-full">
              {isLoading ? "---" : watchedFullName}
            </h2>
            <p
              className="text-sm font-bold text-indigo-600 tracking-wide truncate w-full"
              title={currentDeptLabel}
            >
              {isLoading ? "Đang tải đơn vị..." : currentDeptLabel}
            </p>
            <p
              className="text-xs font-semibold text-slate-600 truncate w-full"
              title={currentPositionLabel}
            >
              {isLoading ? "Đang tải chức vụ..." : currentPositionLabel}
            </p>
          </div>

          <div className="w-full border-t border-slate-200/80 my-5 shrink-0"></div>

          <div className="w-full space-y-4 text-left px-2 min-w-0 max-w-full">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                Tên đăng nhập
              </span>
              <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50/50 px-2 py-1 rounded border border-blue-100/50 inline-block max-w-full truncate">
                {isLoading ? "@..." : `@${meData?.userName}`}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                Email liên hệ
              </span>
              <span className="text-xs font-mono font-medium text-blue-600 block mt-0.5 break-all max-w-full bg-slate-100/60 p-2 rounded border border-slate-200/40">
                {isLoading ? "..." : watchedEmail}
              </span>
            </div>

            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">
                Trạng thái hệ thống
              </span>
              {!isLoading && meData?.isActive !== undefined ? (
                meData.isActive ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Chưa kích hoạt
                  </span>
                )
              ) : (
                <span className="text-xs text-slate-400 font-medium animate-pulse">
                  Đang kiểm tra...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM CHỈNH SỬA CHÍNH */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:col-span-8 p-6 md:p-8 space-y-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Thông tin cá nhân
          </h3>

          <Input
            label="Tên tài khoản (Không thể sửa)"
            type="text"
            disabled
            className="bg-slate-100 cursor-not-allowed"
            {...register("userName")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Họ và tên"
              type="text"
              {...register("fullName", {
                required: "Vui lòng nhập Họ và tên",
                maxLength: { value: 50, message: "Không quá 50 ký tự" },
              })}
              error={errors?.fullName?.message}
            />

            <Input
              label="Email"
              type="text"
              placeholder="abc@gmail.com"
              {...register("email", {
                required: "Vui lòng nhập Email",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email sai định dạng",
                },
              })}
              error={errors?.email?.message}
            />

            <SelectField
              label="Đơn vị"
              options={DEPARTMENTS}
              {...register("department", { required: "Vui lòng chọn đơn vị" })}
              error={errors.department?.message}
            />
            <SelectField
              label="Chức vụ"
              options={availablePositions}
              disabled={availablePositions.length === 0}
              {...register("positions", { required: "Vui lòng chọn chức vụ" })}
              error={errors.positions?.message}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Guard
              requiredPermission={
                UserPermission.USER_VIEW || UserPermission.USER_UPDATE
              }
            >
              <Button
                variant="primary"
                className="px-8 shadow-lg shadow-indigo-200 min-w-30"
                type="submit"
                disabled={isLoading || isSubmitting || cooldownTime > 0}
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : cooldownTime > 0
                    ? `Đợi (${cooldownTime}s)`
                    : "Lưu thay đổi"}
              </Button>
            </Guard>
          </div>
        </form>
      </div>

      {/* (Phần Modal Đổi Mật Khẩu và Dự án giữ nguyên như cũ của bạn bên dưới...) */}
      {/* MODAL ĐỔI MẬT KHẨU TRONG MEFORM.TSX */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden mx-4">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cập nhật bảo mật
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Gọi component đã tách gọn gàng vào đây */}
            <div className="p-5">
              <ResetPasswordForm
                isModal={true}
                onSuccess={() => setIsPasswordModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
