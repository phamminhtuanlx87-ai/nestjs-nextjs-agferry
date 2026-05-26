"use client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import React from "react";
import ProjectStatsBlock from "@/components/modules/cong-trinh/ProjectStatsBlock";
import DSCongTrinh from "@/components/modules/cong-trinh/DSCongTrinh";
import { useCongTrinhData } from "@/hooks/useCongTrinhData";

export default function CongTrinhpage() {
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
          rowsPerPage={20}
        />
      </div>
    </div>
  );
}
