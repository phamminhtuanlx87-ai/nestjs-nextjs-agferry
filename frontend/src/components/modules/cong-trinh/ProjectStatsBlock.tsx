"use client";
import SumIcon from "@/components/ui/SumIcon";
import SummaryCard from "@/components/ui/SummaryCard";
import { useCongTrinhCard } from "./useCongTrinhCard";
import DropDown from "@/components/ui/DropDown";
import { getMonthOptions, YEAR_OPTIONS } from "@/constants/time";
import { BiCalendar, BiNote, BiWallet } from "react-icons/bi";
import { ICongTrinh } from "@/services/congTrinhService";
import FinancialChart from "./FinancialChart";
import { StatCard } from "@/components/ui/StatCard";
import { FiPercent } from "react-icons/fi";

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
  const approvedRevenue = Number(stats.dutoan?.tongDuToan);
  const settlementRevenue = Number(stats.quyetToan?.tongQuyetToan);
  // Tự động tính toán tỷ lệ % thực tế
  const calculatedRate =
    approvedRevenue > 0 ? (settlementRevenue / approvedRevenue) * 100 : 0;
  const rate = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(calculatedRate);

  const discrepancy = approvedRevenue - settlementRevenue;

  const cpxdDuToan = Number(stats.dutoan?.tongCPXD);
  const cpxdQuyetToan = Number(stats.quyetToan?.tongCPXD);
  // Tự động tính toán tỷ lệ % thực tế
  const cpxdCalculatedRate =
    cpxdDuToan > 0 ? (cpxdQuyetToan / cpxdDuToan) * 100 : 0;
  const cpxdRate = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(cpxdCalculatedRate);

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
            Báo cáo tình hình thi công và quyết toán{" "}
            {selectedMonth === 1 ? (
              <span className="font-semibold text-slate-700">
                Tháng 01/{selectedYear}
              </span>
            ) : (
              <>
                <span className="font-semibold text-slate-700">
                  lũy kế từ Tháng 01
                </span>{" "}
                đến{" "}
                <span className="font-semibold text-slate-700">
                  Tháng{" "}
                  {selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}/
                  {selectedYear}
                </span>
              </>
            )}
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
      <div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-6">
            {/* CARD 1: TỔNG DT ĐƯỢC DUYỆT */}
            <StatCard
              id="card-approved-revenue"
              title="Tổng Dự Toán được duyệt"
              icon={<BiWallet size={16} className="text-[#15157d]" />}
              iconBgColor="bg-[#f0ecf5] border-[#e4e1ea]"
              hoverBorderColor="hover:border-[#15157d]/30 cursor-pointer hover:scale-[1.02]  transition-all duration-300"
              value={approvedRevenue}
              value2={cpxdDuToan}
              onClick={() => {
                onCardClick?.("DU_TOAN");
              }}
              footer={
                <>
                  <span className="bg-[#e1e0ff] text-[#15157d] px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-tight">
                    {stats.dutoan?.dsDuToan} công trình
                  </span>
                  <span className="text-[10.5px] text-[#464652] font-medium italic">
                    <span className="font-semibold text-slate-700">
                      lũy kế đến Tháng{" "}
                      {selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}
                      /{selectedYear}
                    </span>
                  </span>
                </>
              }
              backdropSvg={
                <div className="w-30 h-10 opacity-30">
                  <svg
                    viewBox="0 0 100 50"
                    fill="none"
                    className="w-full h-full"
                  >
                    <path
                      d="M0 40 Q25 45 40 25 T80 20 T100 5"
                      stroke="#15157d"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
            />

            {/* CARD 2: TỔNG QUYẾT TOÁN */}
            <StatCard
              id="card-settled-revenue"
              title="Tổng quyết toán"
              icon={<BiNote size={16} className="text-[#1c2c5a]" />}
              iconBgColor="bg-[#f0ecf5] border-[#e4e1ea]"
              hoverBorderColor="hover:border-indigo-200 cursor-pointer hover:scale-[1.02]  transition-all duration-300"
              value={settlementRevenue}
              value2={cpxdQuyetToan}
              onClick={() => onCardClick?.("HOAN_THANH")}
              footer={
                <>
                  <span className="bg-[#cfe5ff] text-[#051d30] px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-tight">
                    {stats.quyetToan?.dsQuyetToan} công trình
                  </span>
                  <span className="text-[10.5px] text-[#464652] font-medium italic">
                    Đã hoàn thành quyết toán
                  </span>
                </>
              }
              backdropSvg={
                <div className="w-20 h-20 opacity-5 -mb-2 -mr-1">
                  <svg
                    viewBox="0 0 50 50"
                    className="w-full h-full text-slate-700"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="20"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      d="M17 25 L22 30 L33 18"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              }
            />

            {/* CARD 3: TỶ LỆ QUYẾT TOÁN */}
            <StatCard
              id="card-settlement-ratio"
              title="Tỷ lệ quyết toán"
              icon={<FiPercent size={16} className="text-[#f491a0]" />}
              iconBgColor="bg-[#fbf4f5] border-[#fce8eb]"
              hoverBorderColor="hover:border-indigo-200"
              value={rate}
              unit="%"
              footer={
                <div className="flex flex-col gap-0.5 -mt-2 w-full">
                  <div className="text-[11.5px] font-bold text-slate-700 flex items-center gap-1">
                    <span>Đã đạt:</span>
                    <span className="text-indigo-600">
                      {parseFloat((settlementRevenue / 1000000000).toFixed(2))}{" "}
                      / {parseFloat((approvedRevenue / 1000000000).toFixed(2))}{" "}
                      tỷ
                    </span>
                  </div>
                  <div className="text-[10.5px] font-medium text-slate-500 flex items-center gap-1 flex-wrap">
                    <span>Ngân sách:</span>
                    {discrepancy > 0 ? (
                      <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                        {new Intl.NumberFormat("vi-VN").format(discrepancy)} đ
                      </span>
                    ) : (
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                        Vượt ngân sách được duyệt
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-self-start gap-1">
                    <span>Riêng Chi phí Xây dựng:</span>
                    <span className="font-semibold text-blue-600">
                      {cpxdRate}%
                    </span>
                    <span className="text-indigo-600">
                      (Đã đạt:{" "}
                      {parseFloat((cpxdQuyetToan / 1000000000).toFixed(2))} /{" "}
                      {parseFloat((cpxdDuToan / 1000000000).toFixed(2))} tỷ)
                    </span>
                  </div>
                </div>
              }
              backdropSvg={
                <div className="w-16 h-16 opacity-15 mb-1">
                  <svg
                    viewBox="0 0 50 50"
                    className="w-full h-full text-slate-400"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <line
                      x1="25"
                      y1="25"
                      x2="25"
                      y2="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <line
                      x1="25"
                      y1="25"
                      x2="36"
                      y2="36"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              }
            />

            {/* CARD 4: BIỂU ĐỒ HOÀN CHỈNH */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-4 relative overflow-hidden shadow-xs h-40 w-full hover:border-amber-200 transition-all">
              <FinancialChart dsCongTrinh={data} selectYear={selectedYear}/>
            </div>
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
