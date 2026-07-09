"use client";

import {
  DANH_SACH_BEN_PHA_OPTIONS,
  DANH_SACH_SO_SANH_OPTIONS,
  DANH_SACH_THOI_GIAN_OPTIONS,
  MAPPING_BEN_PHA_FIELD,
  MAPPING_SO_SANH_FIELD,
  MAPPING_THOI_GIAN_FIELD,
} from "@/services/sanLuongService";
import { FilterToolbarDto } from "../custom-hook/useTQSanLuong";
interface SanLuongToolbarProps {
  filters: FilterToolbarDto;
  // Callback cập nhật, nhận vào tên trường cần sửa và giá trị mới
  onFilters: (tenTruong: keyof FilterToolbarDto, giaTri: string) => void;
}

export default function SanLuongToolbar({
  filters,
  onFilters,
}: SanLuongToolbarProps) {
  // Quản lý trạng thái bộ lọc
  // Hàm nội bộ bắt đầu bằng động từ tiếng Việt để bắt sự kiện thay đổi bến phà
  const xuLyThayDoiBoLoc = (
    tenTruong: keyof FilterToolbarDto,
    suKien: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const giaTriDuocChon = suKien.target.value;
    onFilters(tenTruong, giaTriDuocChon);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* 🟢 TOOLBAR CHÍNH */}
      <div className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm ">
        {/* NHÓM 1: BỘ LỌC (FILTERS) - Chiếm vế trái */}
        <div className="flex flex-wrap items-center gap-4 flex-1 min-w-[60%]">
          {/* 📅 Thời gian */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Thời gian
            </label>
            <select
              id="filter_thoi_gian"
              value={filters?.time || "THANG_NAY"}
              onChange={(e) => xuLyThayDoiBoLoc("time", e)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {DANH_SACH_THOI_GIAN_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 🚢 Bến */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Phạm vi bến
            </label>
            <select
              id="filter_ben_pha"
              value={filters?.location || "ALL"}
              onChange={(e) => xuLyThayDoiBoLoc("location", e)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {DANH_SACH_BEN_PHA_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 📊 Chỉ tiêu
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Chỉ tiêu hiển thị
            </label>
            <select
              // value={filters.metric}
              // onChange={(e) => handleFilterChange('metric', e.target.value)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option>Tổng doanh thu</option>
              <option>Tổng lượt xe</option>
              <option>Tổng hành khách</option>
              <option>Thuê bao</option>
            </select>
          </div> */}

          {/* 🔄 So sánh */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Đối chiếu
            </label>
            <select
              id="filter_so_sanh"
              value={filters?.compare || "THANG_TRUOC"}
              onChange={(e) => xuLyThayDoiBoLoc("compare", e)}
              className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500  cursor-pointer"
            >
              {DANH_SACH_SO_SANH_OPTIONS.filter(
                (e) => e.value !== "KHONG_DOI_CHIEU",
              ).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NHÓM 2 & 3: SEARCH & ACTION - Đẩy về bên phải giúp cân đối layout */}
        <div className="flex items-end gap-3 JSON">
          {/* 🔍 Tìm kiếm (Search) */}
          <div className="flex flex-col gap-1 w-64 sm:w-72">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tìm kiếm nhanh
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bến, tuyến hoặc mã..."
                value={filters?.search || ""}
                onChange={(e) => xuLyThayDoiBoLoc("search", e)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 text-sm rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              />
              <span className="absolute left-3 top-3 text-slate-400 text-sm">
                🔍
              </span>
            </div>
          </div>

          {/* ⟳ Nút Làm mới dữ liệu (Refresh với CSS Tooltip thuần) */}
          <div className="relative group">
            <button className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors h-10 w-10 flex items-center justify-center">
              ⟳
            </button>
            {/* Tooltip hiển thị khi hover */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-md pointer-events-none z-10">
              Làm mới dữ liệu
            </span>
          </div>

          {/* 📤 Nút Xuất dữ liệu (Dropdown Outline) */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-semibold rounded-lg shadow-sm transition-colors h-10">
              <span>📤</span> Xuất file{" "}
              <span className="text-xs text-slate-400">▼</span>
            </button>

            {/* Menu thả xuống các định dạng export */}
            <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-200 rounded-lg shadow-lg hidden group-hover:block z-20">
              <ul className="py-1 text-sm text-slate-700">
                <li className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                  📊 Xuất Excel
                </li>
                <li className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                  📄 Xuất PDF
                </li>
                <li className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2">
                  📋 Xuất CSV
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 3. DÒNG TRẠNG THÁI FILTER ĐANG ÁP DỤNG */}
      <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 bg-slate-50/60 px-2 py-1 rounded-lg">
        <span className="font-medium text-slate-400 uppercase text-[10px] tracking-wider">
          Đang xem:
        </span>

        {/* 1. Trạng thái Thời gian */}
        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100">
          {filters?.time &&
          MAPPING_THOI_GIAN_FIELD[
            filters.time as keyof typeof MAPPING_THOI_GIAN_FIELD
          ]
            ? MAPPING_THOI_GIAN_FIELD[
                filters.time as keyof typeof MAPPING_THOI_GIAN_FIELD
              ]
            : "Tháng này"}
        </span>

        {/* 2. Trạng thái Phạm vi bến (Đảm bảo đồng bộ chuẩn mã ALL hoặc TAT_CA_BEN theo service của bạn) */}
        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-100">
          {filters?.location &&
          MAPPING_BEN_PHA_FIELD[
            filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
          ]
            ? MAPPING_BEN_PHA_FIELD[
                filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
              ]
            : "Tất cả bến phà"}
        </span>

        {/* 3. Trạng thái Kiểu so sánh */}
        <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 font-semibold rounded-full border border-purple-100">
          {filters?.compare &&
          MAPPING_SO_SANH_FIELD[
            filters.compare as keyof typeof MAPPING_SO_SANH_FIELD
          ]
            ? MAPPING_SO_SANH_FIELD[
                filters.compare as keyof typeof MAPPING_SO_SANH_FIELD
              ]
            : "Tuần trước"}
        </span>

        {/* 4. Sửa lại hiển thị Từ khóa Search chuẩn React */}
        {filters?.search && (
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-full border border-slate-200">
            Từ khóa: {`${filters.search}`}
          </span>
        )}
      </div>
    </div>
  );
}
