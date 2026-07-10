"use client";

import SanLuongChartSection from "@/components/modules/doanh-thu/tong-quan/components/charts/SanLuongChartSection";
import SanLuongCard from "@/components/modules/doanh-thu/tong-quan/components/SanLuongCard";
import SanLuongToolbar from "@/components/modules/doanh-thu/tong-quan/components/SanLuongToolbar";
import { useDuLieuComboChart } from "@/components/modules/doanh-thu/tong-quan/custom-hook/charts/useDuLieuComboChart";
import useSanLuongFilter from "@/components/modules/doanh-thu/tong-quan/custom-hook/useSanLuongFilter";
import { useTQSanLuong } from "@/components/modules/doanh-thu/tong-quan/custom-hook/useTQSanLuong";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import Button from "@/components/ui/Button";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React from "react";

export default function DoanhThuPage() {
  const router = useRouter();

  const { filters, xuLyThayDoiBoLoc } = useSanLuongFilter();
  const { duLieuKPI } = useTQSanLuong(filters);
  const {duLieuComboChart } = useDuLieuComboChart(filters);
  // 1. Quản lý bộ lọc thời gian tập trung tại đây

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
              <span className="text-blue-600">
                {dayjs(new Date().toISOString().split("T")[0]).year()}
              </span>
            </h1>
          </div>
        </div>
        {/* Toolber */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 card-soft ">
          <SanLuongToolbar onFilters={xuLyThayDoiBoLoc} filters={filters} />
          {/* ==========================================
           PHÂN KHU 2: CÁC THÈ KPI TỔNG HỢP (Khung Trống)
           ========================================== */}
          <SanLuongCard duLieuKPI={duLieuKPI} />
        </div>
        {/* ==========================================
           PHÂN KHU 3: KHÔNG GIAN BIỂU ĐỒ (Khung Trống)
           ========================================== */}
        <SanLuongChartSection duLieuComboChart={duLieuComboChart} filters={filters}/>

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
                  <td
                    colSpan={4}
                    className="p-8 text-center text-xs text-slate-400 italic font-medium bg-white"
                  >
                    Không có dữ liệu sản lượng trong khoảng thời gian được chọn.
                    Vui lòng bấm nút {`"Thêm dữ liệu"`}.
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
