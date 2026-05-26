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
    <div>
      <h1 className="text-2xl font-bold mb-4">Tổng Quan</h1>
      <hr className="my-6"></hr>
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
    </div>
  );
}
