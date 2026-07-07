"use client";

import React from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { SanLuongFormInputs } from "@/services/sanLuongService";
import { formatMoney } from "@/utils/formatnumber";

interface FinancialRevenueInputProps {
  register: UseFormRegister<SanLuongFormInputs>;
  setValue: UseFormSetValue<SanLuongFormInputs>;
  doanhThuTaiChinhRaw: string | number;
  doanhThuKhacRaw: string | number;
}

export const FinancialRevenueInput: React.FC<FinancialRevenueInputProps> = ({
  register,
  setValue,
  doanhThuTaiChinhRaw,
  doanhThuKhacRaw,
}) => {
  // Hàm xử lý bẫy lỗi NaN: Làm sạch dấu chấm định dạng của chuỗi tiền tệ trước khi lưu dạng Number
  const xuLyThayDoiTien = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "doanh_thu_hd_tai_chinh" | "doanh_thu_khac",
  ) => {
    const chuoiGoc = e.target.value;
    // Bẫy lỗi tài chính: Dùng regex xóa sạch dấu chấm phân tách hàng nghìn trước khi chuyển đổi số
    const chuoiDaLamSach = chuoiGoc.replace(/\./g, "");
    const giaTriSo = Number(chuoiDaLamSach);

    if (!isNaN(giaTriSo)) {
      setValue(fieldName, giaTriSo);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
      {/* Ô nhập Doanh thu hoạt động tài chính */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          💰 Doanh thu Hoạt động Tài chính (VND)
        </label>
        <input
          type="text"
          value={formatMoney(String(doanhThuTaiChinhRaw || 0))}
          onChange={(e) => xuLyThayDoiTien(e, "doanh_thu_hd_tai_chinh")}
          className="w-full px-4 py-2.5 font-mono font-bold text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="0"
        />
        {/* Đăng ký ẩn để giữ liên kết dữ liệu với react-hook-form */}
        <input type="hidden" {...register("doanh_thu_hd_tai_chinh")} />
      </div>

      {/* Ô nhập Doanh thu khác */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          🍃 Doanh thu Khác (VND)
        </label>
        <input
          type="text"
          value={formatMoney(String(doanhThuKhacRaw || 0))}
          onChange={(e) => xuLyThayDoiTien(e, "doanh_thu_khac")}
          className="w-full px-4 py-2.5 font-mono font-bold text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="0"
        />
        <input type="hidden" {...register("doanh_thu_khac")} />
      </div>
    </div>
  );
};
