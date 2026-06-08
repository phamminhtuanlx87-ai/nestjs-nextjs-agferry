"use client";

import DropDown from "@/components/ui/DropDown";
import { getMonthOptions, YEAR_OPTIONS } from "@/constants/time";
import { ICongTrinh } from "@/services/congTrinhService";
import Link from "next/link";
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
  rowsPerPage?: number;
  active?: boolean;
}

export default function HoSoTable({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  data,
  rowsPerPage = 5,
  active = false,
}: QuanLyHoSoPros) {
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >(() => {
    const initialExpandedStates: Record<string, boolean> = {};

    // Quét qua mảng data ngay từ đầu, cấu hình tất cả id thành true (mở sẵn)
    data?.forEach((project) => {
      if (project._id) {
        initialExpandedStates[project._id] = active;
      }
    });

    return initialExpandedStates;
  });

  const toggleProject = (id: string, active: boolean) => {
    setExpandedProjects((prev) => ({ ...prev, [id]: active }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  // const router = useRouter();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  const isAnyExpanded =
    data?.some((project) => expandedProjects[project._id]) || false;

  const toggleAllProjects = () => {
    // 1. Kiểm tra xem hiện tại có dự án nào đang mở không
    const isAnyExpanded = data?.some(
      (project) => expandedProjects[project._id],
    );

    // 2. Khai báo kèm ép kiểu Record để fix lỗi ts(7053)
    const newExpandedState: Record<string, boolean> = {};

    data?.forEach((project) => {
      if (project._id) {
        newExpandedState[project._id] = !isAnyExpanded;
      }
    });

    // 3. Cập nhật trạng thái đồng loạt
    setExpandedProjects(newExpandedState);
  };

  const getFileInfo = (fileName: string) => {
    if (!fileName) return { name: "", ext: "FILE" };

    // 1. Chuyển toàn bộ tên file thành chữ thường để không phân biệt hoa thường khi so sánh
    const lowerName = fileName.toLowerCase();
    let ext = "";

    // 2. Thuật toán "đọc vị từ khóa" để đoán loại file
    if (
      lowerName.includes("bản vẽ") ||
      lowerName.includes("ban ve") ||
      lowerName.includes("dwg")
    ) {
      ext = "DWG";
    } else if (
      lowerName.includes("quyết định") ||
      lowerName.includes("quyet dinh") ||
      lowerName.includes("báo cáo") ||
      lowerName.includes("bao cao") ||
      lowerName.includes("quyết toán") ||
      lowerName.includes("quyet toan") ||
      lowerName.includes("phiếu giao việc") ||
      lowerName.includes("phieu giao viec") ||
      lowerName.includes("pdf")
    ) {
      ext = "PDF";
    } else if (
      lowerName.includes("tờ trình") ||
      lowerName.includes("to trinh") ||
      lowerName.includes("doc") ||
      lowerName.includes("docx")
    ) {
      ext = "DOCX";
    } else if (
      lowerName.includes("hồ sơ dự toán") ||
      lowerName.includes("ho so du toan") ||
      lowerName.includes("hồ sơ thẩm tra") ||
      lowerName.includes("ho so tham tra") ||
      lowerName.includes("excel") ||
      lowerName.includes("xls") ||
      lowerName.includes("xlsx")
    ) {
      ext = "XLSX";
    } else {
      // Nếu có dấu chấm thực tế thì vẫn ưu tiên cắt đuôi file cũ
      const lastDotIndex = fileName.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        ext = fileName.substring(lastDotIndex + 1).toUpperCase();
      } else {
        ext = "FILE"; // Không đoán được thì để mặc định
      }
    }

    // 3. Trả về tên file gốc (giữ nguyên để hiển thị) và đuôi file đã đoán được
    // Nếu file có đuôi chấm ở cuối thực tế thì cắt bỏ, không thì giữ nguyên tên
    const lastDotIndex = fileName.lastIndexOf(".");
    const name =
      lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;

    return { name, ext };
  };

  const badgeColors: { [key: string]: string } = {
    PDF: "bg-red-50 text-red-600 border-red-100",
    DWG: "bg-slate-100 text-slate-600 border-slate-200",
    DOCX: "bg-blue-50 text-blue-600 border-blue-100",
    DOC: "bg-blue-50 text-blue-600 border-blue-100",
    XLSX: "bg-emerald-50 text-emerald-600 border-emerald-100",
    XLS: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  const filteredData = data
    ?.map((project) => {
      // 1. Chỉ giữ lại các giai đoạn thực sự có chứa file_links
      const activeGiaiDoan =
        project.giai_doan?.filter(
          (gd) => Array.isArray(gd.file_links) && gd.file_links.length > 0,
        ) || [];

      // 2. Trả về object công trình mới với mảng giai_doan đã được lọc sạch
      return {
        ...project,
        giai_doan: activeGiaiDoan,
        // Lưu lại số lượng giai đoạn có file của riêng công trình này để hiển thị ở Badge
        totalActiveStages: activeGiaiDoan.length,
      };
    })
    // 3. Loại bỏ hoàn toàn những công trình không có giai đoạn nào chứa file
    ?.filter((project) => project.giai_doan.length > 0)
    // 4. Phân trang
    .slice(start, end);

  const totalItems = filteredData?.length;
  const totalPages = Math.ceil(Number(totalItems) / rowsPerPage);

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
          <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <BiAnchor className="text-blue-600 w-5 h-5" />
              <h2 className="text-sm font-bold text-gray-800">
                1. Hồ sơ theo Công trình &amp; Giai đoạn
              </h2>
            </div>
            <div className="text-[11px] font-bold text-slate-500">
              <div className=" bg-slate-200 border border-slate-50 rounded-2xl p-2 inline">
                {"Để xem tài liệu vui lòng đăng nhập:  "}
                <a
                  href="https://angiang.vnptioffice.vn/vpdt/main?lang=vi"
                  target="blank"
                  className="text-blue-500 italic text-sm"
                >
                  angiang.vnptioffice.vn
                </a>
              </div>
            </div>
          </div>
          <div className="h-4 w-px bg-gray-200 "></div>
          <button
            onClick={toggleAllProjects}
            className={`flex cursor-pointer items-center justify-end gap-1 px-2.5 py-1 mx-2 text-sm font-medium border rounded-md shadow-sm transition-all duration-200 active:scale-95 ${
              isAnyExpanded
                ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100/70 hover:text-blue-700"
            }`}
          >
            {isAnyExpanded ? (
              <>
                {/* Icon Thu gọn (Đóng lại) */}
                <svg
                  className="w-3.5 h-3.5 stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 11l7-7 7 7M5 19l7-7 7 7"
                  />
                </svg>
                <span >Đóng tất cả</span>
              </>
            ) : (
              <>
                {/* Icon Bung rộng (Mở ra) */}
                <svg
                  className="w-3.5 h-3.5 stroke-[2.5]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 13l-7 7-7-7m14-6l-7 7-7-7"
                  />
                </svg>
                <span>Mở tất cả</span>
              </>
            )}
          </button>

          <div className="p-4 flex-1 space-y-4">
            <div className="space-y-4">
              {filteredData?.map((project) => (
                <div
                  key={project._id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mb-4"
                >
                  {/* 1. HEADER CỦA CÔNG TRÌNH */}
                  <div
                    className="bg-gray-50/70 px-4 py-3 flex items-center justify-between cursor-pointer border-b border-gray-200 select-none hover:bg-gray-50 transition-colors"
                    onClick={() =>
                      toggleProject(project._id, !expandedProjects[project._id])
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                        {project.ten_cong_trinh}
                      </h3>
                      {expandedProjects[project._id] ? (
                        <BiChevronDown size={18} className="text-gray-500" />
                      ) : (
                        <BiChevronRight size={18} className="text-gray-500" />
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Đếm chuẩn số giai đoạn có file */}
                      <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                        {project.totalActiveStages} GIAI ĐOẠN
                      </span>
                    </div>
                  </div>

                  {/* 2. RUỘT BÊN TRONG (DANH SÁCH GIAI ĐOẠN & FILE) */}
                  {expandedProjects[project._id] && (
                    <div className="p-4 space-y-5 bg-white">
                      {project.giai_doan?.map((gd) => (
                        <div key={gd.ma_hieu} className="space-y-2">
                          {/* Tiêu đề của Giai đoạn */}
                          <div
                            onClick={() =>
                              toggleProject(
                                project._id + gd.ma_hieu,
                                !expandedProjects[project._id + gd.ma_hieu],
                              )
                            }
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <BiFolderOpen className="text-amber-500 w-4 h-4" />
                            <span>{gd.ten_giai_doan}</span>
                            <span className="text-gray-400 font-normal">
                              ({gd.file_links?.length || 0} tài liệu)
                            </span>
                          </div>

                          <div className="border border-gray-100 rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-100 text-left text-xs">
                              <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                                {/* VÒNG LẶP MAP CHUẨN ĐỂ ĐỔ FILE_LINKS TỰ ĐỘNG */}
                                {gd.file_links?.map((link, idx) => {
                                  // Gọi hàm lấy tên và đuôi file (Đã chuẩn bị từ câu trước)
                                  const { ext } = getFileInfo(link.link_name);

                                  // 2. KIỂM TRA MÀU: Nếu ext tồn tại trong badgeColors thì lấy, ngược lại dùng màu xám mặc định
                                  const currentBadgeColor =
                                    badgeColors[ext] ||
                                    "bg-gray-50 text-gray-600 border-gray-200";

                                  // 3. KIỂM TRA KÝ HIỆU: Nếu không có đuôi file (file không có dạng .ext) thì hiện chữ "FILE"
                                  const currentExtensionLabel = ext || "FILE";
                                  return (
                                    <tr
                                      key={idx}
                                      className="hover:bg-gray-50/50 transition-colors"
                                    >
                                      <td className="px-3 py-2 flex items-center gap-2">
                                        {/* BADGE ĐUÔI FILE TỰ ĐỘNG */}
                                        <span
                                          className={`${currentBadgeColor} font-bold text-[9px] px-1 rounded border uppercase`}
                                        >
                                          {currentExtensionLabel || "FILE"}
                                        </span>

                                        {/* TÊN FILE ĐÃ CẮT ĐUÔI + CHỐNG TRÀN CHỮ */}
                                        
                                        <Link
                                          href={link.link_url}
                                          target="_blank"
                                          className="truncate max-w-xs sm:max-w-md cursor-pointer hover:text-blue-600 font-medium text-gray-900"
                                          title={link.link_name}
                                        >
                                          {link.link_name}
                                        </Link>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Bảng danh sách các File của giai đoạn này */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* INFO + PAGINATION */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Hiển thị {start + 1} - {Math.min(end, Number(totalItems))} của{" "}
                {totalItems} công trình
              </p>

              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  ›
                </button>
              </div>
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
