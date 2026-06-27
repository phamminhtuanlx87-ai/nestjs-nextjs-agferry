"use client";

import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import Button from "@/components/ui/Button";
import DropDown from "@/components/ui/DropDown";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BiCalendar } from "react-icons/bi";

export default function DoanhThuPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const startYear = 2025;
  const router = useRouter();
  const getMonthOptions = (selectedYear: number) => {
    const allMonths = [
      { value: 1, label: "Tháng 01" },
      { value: 2, label: "Tháng 02" },
      { value: 3, label: "Tháng 03" },
      { value: 4, label: "Tháng 04" },
      { value: 5, label: "Tháng 05" },
      { value: 6, label: "Tháng 06" },
      { value: 7, label: "Tháng 07" },
      { value: 8, label: "Tháng 08" },
      { value: 9, label: "Tháng 09" },
      { value: 10, label: "Tháng 10" },
      { value: 11, label: "Tháng 11" },
      { value: 12, label: "Tháng 12" },
    ];

    // Nếu năm được chọn là năm hiện tại, lọc lấy các tháng <= tháng hiện tại
    if (Number(selectedYear) === currentYear) {
      return allMonths.filter((month) => month.value <= currentMonth);
    }

    // Nếu là năm khác (ví dụ năm quá khứ), hiện đủ 12 tháng
    return allMonths;
  };

  // 2. Tự động sinh mảng từ năm 2025 đến năm hiện tại
  const YEAR_OPTIONS = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => {
      const year = startYear + index;
      return {
        value: year,
        label: `Năm ${year}`,
      };
    },
  );

  const [selectedMonth, setSelectedMonth] = useState<number>(
    now.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  return (
    <div>
      <DynamicBreadcrumb />
      {/* Container Tổng của trang Quản lý Doanh thu */}
      <div className="w-full  bg-gray-50  mx-auto p-2 md:p-6 space-y-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {/* Cụm Tiêu Đề bên trái */}
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mb-1">
              <span className="w-8 h-0.5 bg-blue-600"></span>
              Hệ thống quản lý Sản lượng & Doanh thu
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Quản lý Sản lượng Doanh thu năm{" "}
              <span className="text-blue-600">{selectedYear}</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Tổng hợp và báo cáo Sản lượng doanh thu từ{" "}
              <span className="font-semibold text-slate-700">Tháng 01 </span>đến{" "}
              <span className="font-semibold text-slate-700">
                {`Tháng ${selectedMonth}/${selectedYear}`}
              </span>
            </p>
          </div>
          {/* Bộ chọn thời gian bên phải (Optionally) */}
          <div className="flex items-center gap-3">
            {/* Nút lọc Tháng */}
            <div className="relative inline-block text-left">
              <DropDown
                label="Tháng"
                items={getMonthOptions(selectedYear)}
                value={selectedMonth}
                icon={<BiCalendar className="w-4 h-4" />}
                onChange={(val) => setSelectedMonth(Number(val))}
              />
            </div>
            {/* Nút lọc Năm */}
            <div className="relative inline-block text-left">
              <DropDown
                label="Năm"
                items={YEAR_OPTIONS}
                value={selectedYear}
                icon={<BiCalendar className="w-4 h-4" />}
                onChange={(val) => setSelectedYear(Number(val))}
              />
            </div>
          </div>
        </div>

        {/* THANH TỔNG HỢP & NÚT LƯU (Responsive Chặt Chẽ) */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-md">
          <div className="text-center sm:text-left">
            <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">
              Tổng cộng doanh thu
            </span>
            <span className="text-2xl font-black text-blue-900">
              397.050.000 VNĐ
            </span>
          </div>
        </div>
        {/* ==========================================
       KHỐI HẠ TẦNG: BẢNG DỮ LIỆU ĐỐI SOÁT
       ========================================== */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 mb-4">
              Dữ liệu Sản lượng Doanh thu
            </h3>
            <Button variant="primary" onClick={() => router.push("/doanh-thu/nhap-lieu")}>
              + Thêm dữ liệu
            </Button>
          </div>
          {/* 🛡️ CHỐT CHẶN BỂ TABLE: Sử dụng overflow-x-auto để điện thoại vuốt ngang mượt mà */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-150">
              <thead>
                <tr className="bg-gray-100 text-sm text-gray-600">
                  <th className="p-3 border-b">Ngày</th>
                  <th className="p-3 border-b">Bến phà</th>
                  <th className="p-3 border-b text-right">Tổng doanh thu</th>
                  <th className="p-3 border-b text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b">15/08/2026</td>
                  <td className="p-3 border-b">Bến phà Gót</td>
                  <td className="p-3 border-b text-right font-bold text-green-600">
                    184,250,000
                  </td>
                  <td className="p-3 border-b text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      ĐÃ CHỐT
                    </span>
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
