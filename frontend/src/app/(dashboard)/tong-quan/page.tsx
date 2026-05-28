"use client";
import DSCongTrinh from "@/components/modules/cong-trinh/DSCongTrinh";
import ProjectStatsBlock from "@/components/modules/cong-trinh/ProjectStatsBlock";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useCongTrinhData } from "@/hooks/useCongTrinhData";

export default function TongQuanPage() {
  // Lấy toàn bộ "vũ khí" ra từ Custom Hook dùng chung
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    dsCongTrinh,
    filteredTableData, // Mảng ĐÃ LỌC động truyền cho Bảng hiển thị
    setFilterStatus,
    loading,
  } = useCongTrinhData();

  if (loading) return <LoadingScreen />;

  return (
   <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* KHỐI 1: CÔNG TRÌNH */}
      <div className="flex flex-col gap-6">
        <ProjectStatsBlock
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          data={dsCongTrinh}
          loading={loading}
          onCardClick={setFilterStatus}
        />
        <DSCongTrinh
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          data={filteredTableData}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KHỐI 2: MẢNG DOANH THU / LỢI NHUẬN (Nằm bên trái) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            
            <span className="text-base">💰</span>
            <h2 className="text-base font-bold text-slate-700 font-sans">
              Doanh thu & Lợi nhuận
            </h2>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm">
            {/* Sau này anh ném Biểu đồ đường/cột hoặc Thống kê tiền vé phà vào đây */}
            [Nơi vẽ Biểu đồ Doanh thu phà]
          </div>
        </div>

        {/* KHỐI 3: MẢNG TUA CHUYẾN / PHƯƠNG TIỆN (Nằm bên phải) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <span className="text-base">🚢</span>
            <h2 className="text-base font-bold text-slate-700 font-sans">
              Tình hình Tua chuyến hôm nay
            </h2>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm">
            {/* Sau này anh ném danh sách các phà đang chạy, số chuyến trong ngày vào đây */}
            [Nơi hiển thị Lịch chạy phà / Tua chuyến]
          </div>
        </div>
      </div>

      {/* =========================================================================
      KHỐI 4: MẢNG NHÂN SỰ / TIỀN LƯƠNG (Hoặc một khối lớn khác nằm dưới cùng)
      ========================================================================= */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <span className="text-base">👥</span>
          <h2 className="text-base font-bold text-slate-700 font-sans">
            Tóm tắt Nhân sự & Biến động ca kíp
          </h2>
        </div>
        <div className="p-4 text-center text-slate-400 text-sm">
          [Số lượng thuyền viên đang làm việc / Tổng quân số ca trực]
        </div>
      </div>
    </div>
  );
}
