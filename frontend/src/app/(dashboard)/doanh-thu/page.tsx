"use client";

import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import Button from "@/components/ui/Button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React from "react";

export default function DoanhThuPage() {
  const router = useRouter();


  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <DynamicBreadcrumb />
      
      <div className="w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* ==========================================
           PHÂN KHU 1: TIÊU ĐỀ & BỘ LỌC
           ========================================== */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gray-200/60 pb-5">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-medium text-xs uppercase tracking-wider mb-1">
              <span className="w-6 h-0.5 bg-blue-600"></span>
              Hệ thống quản lý Sản lượng & Doanh thu
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
              Quản lý Sản lượng Doanh thu năm{" "}
              <span className="text-blue-600">{dayjs(new Date().toISOString().split("T")[0]).year()}</span>
            </h1>
          </div>
        </div>

        {/* ==========================================
           PHÂN KHU 2: CÁC THÈ KPI TỔNG HỢP (Khung Trống)
           ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-dashed border-gray-300 flex flex-col justify-between min-h-22.5">
            <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">
              Tổng cộng doanh thu 
            </span>
            <span className="text-xl font-bold text-slate-400 font-mono mt-2">
              -- đ
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-dashed border-gray-300 flex flex-col justify-between min-h-22.5">
            <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">
              Tổng sản lượng 
            </span>
            <span className="text-xl font-bold text-slate-400 font-mono mt-2">
              -- Lượt xe
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-dashed border-gray-300 flex flex-col justify-between min-h-22.5">
            <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">
              Trạng thái
            </span>
            <span className="text-xl font-bold text-slate-400 font-mono mt-2">
              -- Bến
            </span>
          </div>
        </div>

        {/* ==========================================
           PHÂN KHU 3: KHÔNG GIAN BIỂU ĐỒ (Khung Trống)
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-dashed border-slate-300 flex flex-col justify-between min-h-70">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wide">
              📊 Biểu đồ xu hướng Doanh thu (Đang hoàn thiện)
            </h3>
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium italic">
              Không có dữ liệu hiển thị
            </div>
          </div>

          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-dashed border-slate-300 flex flex-col justify-between min-h-70">
            <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wide">
              🍩 Biểu đồ tỷ trọng sản lượng (Đang hoàn thiện)
            </h3>
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400 font-medium italic">
              Không có dữ liệu hiển thị
            </div>
          </div>
        </div>

        {/* ==========================================
           PHÂN KHU 4: BẢNG DỮ LIỆU ĐỐI SOÁT (Bảng Trống + Nút Thêm)
           ========================================== */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-gray-200 flex items-center justify-between gap-4">
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              📋 Danh sách lịch sử Sản lượng Doanh thu
            </h3>
            <Button 
              variant="primary" 
              onClick={() => router.push("/doanh-thu/nhap-lieu")}
              className="text-xs font-bold py-1.5 px-3.5"
            >
              + Thêm dữ liệu
            </Button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-500 font-bold border-b border-gray-200">
                  <th className="p-3.5">Ngày nhập</th>
                  <th className="p-3.5">Bến phà áp dụng</th>
                  <th className="p-3.5 text-right">Tổng doanh thu</th>
                  <th className="p-3.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-slate-400 italic font-medium bg-white">
                    Không có dữ liệu sản lượng trong khoảng thời gian được chọn. Vui lòng bấm nút {`"Thêm dữ liệu"`}.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}