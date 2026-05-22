"use client";
import { Guard } from "@/components/common/Guard";
import Button from "@/components/ui/Button";
import { ICongTrinh } from "@/services/congTrinhService";
import { UserPermission } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React from "react";
import { FiArrowLeft, FiEdit3 } from "react-icons/fi";

interface Props {
  congTrinh?: ICongTrinh;
  mode: "view" | "edit";
  isLoading?: boolean;
  cooldownTime?: number;
  onSave?: () => void;
}

export default function TieuDeCongTrinh({
  mode,
  congTrinh,
  isLoading,
  cooldownTime = 0,
  onSave,
}: Props) {
  const router = useRouter();
  return (
    <div>
      {/* 1. THANH TIÊU ĐỀ HỒ SƠ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
        <header className="bg-white ">
          <div className="w-full mx-auto flex justify-between items-center">
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => router.back()}
                className="p-2.5 mb-1 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-all border border-slate-200 active:scale-95"
              >
                <FiArrowLeft size={20} />
              </Button>
              <div className="backdrop-blur-md border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] mb-2 font-bold text-accent uppercase tracking-widest bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                    {mode === "edit"
                      ? "Chế độ chỉnh sửa hồ sơ"
                      : "Chế độ xem hồ sơ"}
                  </span>
                  <span className="text-[10px] mb-2 font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                    Mã công trình:{" "}
                    <span className="text-blue-700">
                      {" "}
                      {congTrinh?.ma_cong_trinh || ""}
                    </span>
                  </span>
                </div>
                <h1 className="text-xl mb-1 font-bold text-slate-900 flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>{" "}
                  {/* Điểm nhấn side-bar nhỏ */}
                  Hồ sơ:{" "}
                  <span className="text-indigo-600 uppercase ml-1">
                    {/* Tên công trình */} {congTrinh?.ten_cong_trinh}
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Nút điều hướng sang trang edit khi cần */}
        {mode === "view" && (
          <Button
            onClick={() => router.push(`/cong-trinh/${congTrinh?._id}/edit`)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-[0_4px_12px_-3px_rgba(15,23,42,0.3)] hover:shadow-indigo-200 active:scale-95"
          >
            <FiEdit3 size={16} /> Đi tới Chỉnh sửa
          </Button>
        )}
        {mode === "edit" && (
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="px-6 border-slate-300"
              onClick={() => router.push("/cong-trinh")}
            >
              Quay lại danh sách công trình
            </Button>
            <Guard requiredPermission={UserPermission.PROJECT_UPDATE}>
              <Button
                variant="primary"
                className="px-8 shadow-lg shadow-indigo-200 min-w-20"
                onClick={onSave}
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu dữ liệu..." : "Lưu thay đổi"}
                <br />
                {cooldownTime > 0
                  ? `Vui lòng đợi (${Math.floor(cooldownTime / 60)}p:${cooldownTime % 60}s)`
                  : ""}
              </Button>
            </Guard>
          </div>
        )}
      </div>
    </div>
  );
}
