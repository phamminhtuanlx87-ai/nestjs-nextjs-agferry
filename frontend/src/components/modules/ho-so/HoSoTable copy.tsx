"use client";

import DropDown from "@/components/ui/DropDown";
import { getMonthOptions, YEAR_OPTIONS } from "@/constants/time";
import { ICongTrinh } from "@/services/congTrinhService";
import React, { useState } from "react";
import {
  BiChevronDown,
  BiChevronRight,
  BiFolderOpen,
  BiSearch,
  BiAnchor,
  BiFile,
  BiBookmark,
  BiCalendar,
} from "react-icons/bi";
import { FiDownload, FiEye } from "react-icons/fi";

interface QuanLyHoSoPros {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  data: ICongTrinh[];
  loading: boolean;
}

export default function HoSoTable({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  data,
}: QuanLyHoSoPros) {
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >({
    A04: true,
    GiaiDoanII: true,
  });

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full bg-gray-50/50">
      {/* TIÊU ĐỀ TRANG & NÚT HÀNH ĐỘNG */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Cụm Tiêu Đề bên trái */}
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mb-1">
            <span className="w-8 h-0.5 bg-blue-600"></span>
            Hệ thống quản lý Hồ sơ/ Văn bản hành chính
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Hồ sơ và Văn bản hành chính{" "}
            <span className="text-blue-600">{selectedYear}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tổng hợp Hồ sơ và Văn bản hành chính tính từ{" "}
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
              onChange={(val) => onMonthChange(Number(val))}
            />
          </div>
          {/* Nút lọc Năm */}
          <div className="relative inline-block text-left">
            <DropDown
              label="Năm"
              items={YEAR_OPTIONS}
              value={selectedYear}
              icon={<BiCalendar className="w-4 h-4" />}
              onChange={(val) => onYearChange(Number(val))}
            />
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM TỔNG HỢP CHO CẢ 3 KHU VỰC */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          Hệ thống dữ liệu trực tuyến
        </div>
        <div className="relative w-full sm:w-96">
          <BiSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm kiếm văn bản nhanh trên toàn hệ thống..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-gray-700"
          />
        </div>
      </div>

      {/* BỐ CỤC CHIA THÀNH 3 KHU VỰC HIỂN THỊ CHUNG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ========================================================================= */}
        {/* KHU VỰC 1 (BÊN TRÁI - CHIẾM 7/12 CỘT): HỒ SƠ THEO CÔNG TRÌNH & GIAI ĐOẠN */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex items-center gap-2">
            <BiAnchor className="text-blue-600 w-5 h-5" />
            <h2 className="text-sm font-bold text-gray-800">
              1. Hồ sơ theo Công trình &amp; Giai đoạn
            </h2>
          </div>
          
          <div className="p-4 flex-1 space-y-4">
            {/* Cụm công trình A04 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Header Công trình */}
              <div
                className="bg-gray-50/60 px-4 py-3 flex items-center justify-between cursor-pointer border-b border-gray-200"
                onClick={() => toggleProject("A04")}
              >
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SỬA CHỮA TRÊN ĐÀ PHÀ A04 (AG-21138)
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold">
                    2 GIAI ĐOẠN
                  </span>
                  {expandedProjects["A04"] ? (
                    <BiChevronDown size={18} />
                  ) : (
                    <BiChevronRight size={18} />
                  )}
                </div>
              </div>

              {/* Nội dung các giai đoạn */}
              {expandedProjects["A04"] && (
                <div className="p-4 space-y-4 bg-white">
                  {/* Giai đoạn II */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                      <BiFolderOpen className="text-amber-500 w-4 h-4" />
                      <span>II. Khảo sát và Lập Dự toán</span>
                    </div>
                    <div className="border border-gray-100 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                        <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                          <tr className="hover:bg-gray-50/50">
                            <td className="px-3 py-2 flex items-center gap-2">
                              <span className="bg-red-50 text-red-600 font-bold text-[9px] px-1 rounded border border-red-100">
                                PDF
                              </span>
                              <span className="truncate max-w-xs sm:max-w-md cursor-pointer hover:text-blue-600">
                                Bien_ban_khao_sat_hien_trang_pha_A04.pdf
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-400">
                              <div className="flex justify-end gap-3">
                                <button className="hover:text-blue-600">
                                  <FiEye size={14} />
                                </button>
                                <button className="hover:text-blue-600">
                                  <FiDownload size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50/50">
                            <td className="px-3 py-2 flex items-center gap-2">
                              <span className="bg-slate-100 text-slate-600 font-bold text-[9px] px-1 rounded border border-slate-200">
                                DWG
                              </span>
                              <span className="truncate max-w-xs sm:max-w-md cursor-pointer hover:text-blue-600">
                                Ban_ve_ky_thuat_khao_sat_than_pha.dwg
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-400">
                              <div className="flex justify-end gap-3">
                                <button className="hover:text-blue-600">
                                  <FiEye size={14} />
                                </button>
                                <button className="hover:text-blue-600">
                                  <FiDownload size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Giai đoạn IV */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                      <BiFolderOpen className="text-amber-500 w-4 h-4" />
                      <span>IV. Phê duyệt Dự toán</span>
                    </div>
                    <div className="border border-gray-100 rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                        <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                          <tr className="hover:bg-gray-50/50">
                            <td className="px-3 py-2 flex items-center gap-2">
                              <span className="bg-red-50 text-red-600 font-bold text-[9px] px-1 rounded border border-red-100">
                                PDF
                              </span>
                              <span className="truncate max-w-xs sm:max-w-md cursor-pointer hover:text-blue-600">
                                Quyet_dinh_phe_duyet_du_toan_sua_chua.pdf
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right text-gray-400">
                              <div className="flex justify-end gap-3">
                                <button className="hover:text-blue-600">
                                  <FiEye size={14} />
                                </button>
                                <button className="hover:text-blue-600">
                                  <FiDownload size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (CHIẾM 5/12 CỘT): CHỨA KHU VỰC 2 VÀ KHU VỰC 3 CHỒNG LÊN NHAU */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* ========================================================================= */}
          {/* KHU VỰC 2 (PHẢI TRÊN): VĂN BẢN HÀNH CHÍNH CHUNG */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex items-center gap-2">
              <BiFile className="text-emerald-600 w-5 h-5" />
              <h2 className="text-sm font-bold text-gray-800">
                2. Văn bản Hành chính
              </h2>
            </div>
            <div className="p-4 flex-1">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className="bg-red-50 text-red-600 font-bold text-[9px] px-1 rounded border border-red-100">
                          PDF
                        </span>
                        <span className="truncate max-w-50 sm:max-w-xs cursor-pointer hover:text-blue-600">
                          Quy_che_quan_ly_bao_tri_2026.pdf
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">
                        <div className="flex justify-end gap-3">
                          <button className="hover:text-blue-600">
                            <FiEye size={14} />
                          </button>
                          <button className="hover:text-blue-600">
                            <FiDownload size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-600 font-bold text-[9px] px-1 rounded border border-blue-100">
                          DOCX
                        </span>
                        <span className="truncate max-w-50 sm:max-w-xs cursor-pointer hover:text-blue-600">
                          Mau_to_trinh_xin_cap_kinh_phi.docx
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">
                        <div className="flex justify-end gap-3">
                          <button className="hover:text-blue-600">
                            <FiEye size={14} />
                          </button>
                          <button className="hover:text-blue-600">
                            <FiDownload size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* KHU VỰC 3 (PHẢI DƯỚI): CÁ NHÂN THEO DÕI */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex items-center gap-2">
              <BiBookmark className="text-amber-500 w-5 h-5" />
              <h2 className="text-sm font-bold text-gray-800">
                3. Cá nhân theo dõi
              </h2>
            </div>
            <div className="p-4 flex-1">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                    <tr className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 flex items-center gap-2">
                        <span className="bg-red-50 text-red-600 font-bold text-[9px] px-1 rounded border border-red-100">
                          PDF
                        </span>
                        <span className="truncate max-w-50 sm:max-w-xs cursor-pointer hover:text-blue-600">
                          Bao_cao_tien_do_giai_ngan_pha_A04.pdf
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">
                        <div className="flex justify-end gap-3">
                          <button className="hover:text-blue-600">
                            <FiEye size={14} />
                          </button>
                          <button className="hover:text-blue-600">
                            <FiDownload size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
