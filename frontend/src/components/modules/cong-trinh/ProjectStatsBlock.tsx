"use client";
import SumIcon from "@/components/ui/SumIcon";
import SummaryCard from "@/components/ui/SummaryCard";
import { useCongTrinhCard } from "./useCongTrinhCard";
import DropDown from "@/components/ui/DropDown";
import { getMonthOptions, YEAR_OPTIONS } from "@/constants/time";
import { BiCalendar } from "react-icons/bi";
import { ICongTrinh } from "@/services/congTrinhService";

interface ProjectStatsBlockProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  data: ICongTrinh[];
  loading: boolean;
  filterStatus?: string;
  onCardClick?: (status: string) => void;
}

export default function ProjectStatsBlock({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  data,
  loading,
  onCardClick,
}: ProjectStatsBlockProps) {
  const stats = useCongTrinhCard({
    dsCongTrinh: data || [], // Fallback mảng rỗng phòng khi trang cha chưa load xong
    selectedMonth,
    selectedYear,
  });

  return (
    <div className="relative w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Cụm Tiêu Đề bên trái */}
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-medium text-sm mb-1">
            <span className="w-8 h-0.5 bg-blue-600"></span>
            Hệ thống quản lý Công trình/Dự án
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
           Công trình và dự án năm{" "}
            <span className="text-blue-600">{selectedYear}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Báo cáo tình hình thi công và quyết toán tính đến{" "}
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

      {/* 2. Grid hiển thị 4 Card thống kê */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <SummaryCard
          color="bg-indigo-800"
          title="Tổng công trình"
          value={stats.total.current}
          change={stats.total.change}
          subtile={`${stats.total.change} so với tháng trước`}
          description={stats.total.timeAgo}
          icon={<SumIcon variant="projects" />}
          onClick={() => onCardClick?.("ALL")}
        />

        <SummaryCard
          color="bg-slate-700"
          title="Đang thi công và nghiệm thu"
          value={stats.thiCong.current}
          change={stats.thiCong.change}
          progressbar={stats.thiCong.thiCongRatio}
          subtile={`Chiếm ${stats.thiCong.percent}`}
          description={stats.thiCong.timeAgo}
          icon={<SumIcon variant="progress" />}
          onClick={() => onCardClick?.("THI_CONG")}
        />

        <SummaryCard
          color="bg-orange-500"
          title="Đang quyết toán"
          value={stats.quyetToan.current}
          change={stats.quyetToan.change}
          progressbar={stats.quyetToan.quyetToanRatio}
          subtile={`Chiếm ${stats.quyetToan.percent}`}
          description={stats.quyetToan.timeAgo}
          icon={<SumIcon variant="done" />}
          onClick={() => onCardClick?.("QUYET_TOAN")}
        />

        <SummaryCard
          color="bg-green-600"
          title="Hoàn thành"
          value={stats.hoanThanh.current}
          change={stats.hoanThanh.change}
          progressbar={stats.hoanThanh.hoanThanhRatio}
          subtile={`Đã hoàn thành ${stats.hoanThanh.percent}`}
          description={stats.hoanThanh?.timeAgo}
          icon={<SumIcon variant="warning" />}
          onClick={() => onCardClick?.("HOAN_THANH")}
        />
      </section>

      {/* 3. Lớp Modal Loading độc lập (Chỉ phủ lên cụm card khi load lại dữ liệu bộ lọc) */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] rounded-2xl">
          <div className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-xs">Đang cập nhật số liệu...</span>
          </div>
        </div>
      )}
    </div>
  );
}
