"use client";
import DSCongTrinh from "@/components/modules/cong-trinh/DSCongTrinh";
import ProjectStatsBlock from "@/components/modules/cong-trinh/ProjectStatsBlock";
import HoSoTable from "@/components/modules/ho-so/HoSoTable";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useCongTrinhData } from "@/hooks/useCongTrinhData";
import { useRouter } from "next/navigation";
import { HiOutlineArrowSmRight } from "react-icons/hi";
export default function TongQuanPage() {
  // Lấy toàn bộ "vũ khí" ra từ Custom Hook dùng chung
  const router = useRouter();
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    dsCongTrinh,
    filteredTableData, // Mảng ĐÃ LỌC động truyền cho Bảng hiển thị
    setFilterStatus,
    loading,
    refreshData,
  } = useCongTrinhData();

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen space-y-3">
      <DynamicBreadcrumb />
      {/* KHỐI 1: CÔNG TRÌNH */}
      <div className="flex flex-col gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm">
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
          data={filteredTableData}
          rowsPerPage={20}
          onRefresh={refreshData}
        />
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => router.push("/cong-trinh")} // Chuyển hướng sang trang hồ sơ
            className="group cursor-pointer relative flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-blue-600 bg-blue-50/60 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-100 transition-all duration-300 ease-out active:scale-95"
          >
            {/* Hiệu ứng mờ ảo phía sau khi hover */}
            <span className="absolute inset-0 w-full h-full rounded-xl bg-blue-400/10 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

            <span className="relative tracking-wide uppercase">
              Xem tất cả Công trình
            </span>

            {/* Icon mũi tên tự động chuyển động tịnh tiến khi di chuột vào */}
            <HiOutlineArrowSmRight
              size={16}
              className="relative transform group-hover:translate-x-1.5 transition-transform duration-300 ease-in-out"
            />
          </button>
        </div>
      </div>
      {/* =========================================================================
      KHỐI: HỒ SƠ / VĂN BẢN)
      ========================================================================= */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <HoSoTable
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          data={dsCongTrinh}
          loading={loading}
        />
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => router.push("/ho-so")} // Chuyển hướng sang trang hồ sơ
            className="group cursor-pointer relative flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-blue-600 bg-blue-50/60 hover:bg-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-100 transition-all duration-300 ease-out active:scale-95"
          >
            {/* Hiệu ứng mờ ảo phía sau khi hover */}
            <span className="absolute inset-0 w-full h-full rounded-xl bg-blue-400/10 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

            <span className="relative tracking-wide uppercase">
              Xem tất cả hồ sơ & văn bản
            </span>

            {/* Icon mũi tên tự động chuyển động tịnh tiến khi di chuột vào */}
            <HiOutlineArrowSmRight
              size={16}
              className="relative transform group-hover:translate-x-1.5 transition-transform duration-300 ease-in-out"
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* KHỐI: MẢNG DOANH THU / LỢI NHUẬN (Nằm bên trái) */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <span className="text-base">💰</span>
            <h2 className="text-base font-bold text-slate-700 font-sans">
              Doanh thu & Lợi nhuận
            </h2>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm">
            {/* Sau này anh ném Biểu đồ đường/cột hoặc Thống kê tiền vé phà vào đây */}
            [Nơi vẽ Biểu đồ Doanh thu phà] ... Đang phát triển thêm tính năng
            này nên tạm thời chưa có dữ liệu để hiển thị
          </div>
        </div>

        {/* KHỐI: MẢNG TUA CHUYẾN / PHƯƠNG TIỆN (Nằm bên phải) */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <span className="text-base">🚢</span>
            <h2 className="text-base font-bold text-slate-700 font-sans">
              Tình hình Tua chuyến hôm nay
            </h2>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm">
            {/* Sau này anh ném danh sách các phà đang chạy, số chuyến trong ngày vào đây */}
            [Nơi hiển thị Lịch chạy phà / Tua chuyến] ... Đang phát triển thêm
            tính năng này nên tạm thời chưa có dữ liệu để hiển thị
          </div>
        </div>
      </div>
    </div>
  );
}
