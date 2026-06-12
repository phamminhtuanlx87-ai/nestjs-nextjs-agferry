"use client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import React, { useRef } from "react";
import ProjectStatsBlock from "@/components/modules/cong-trinh/ProjectStatsBlock";
import DSCongTrinh from "@/components/modules/cong-trinh/DSCongTrinh";
import { useCongTrinhData } from "@/hooks/useCongTrinhData";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";

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
    refreshData,
  } = useCongTrinhData();

  const tableRef = useRef<HTMLDivElement>(null);
  const handleCardClick = (status: string) => {
    setFilterStatus(status); // Vẫn đổi bộ lọc card như cũ

    // Ra lệnh cuộn màn hình xuống vị trí Table
    tableRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  if (loading) return <LoadingScreen />;

  return (
    <div>
      <div className="flex flex-col gap-6">
        <DynamicBreadcrumb />
        <ProjectStatsBlock
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          data={dsCongTrinh}
          loading={loading}
          onCardClick={handleCardClick}
        />
        <div ref={tableRef}>
          <DSCongTrinh
            data={filteredTableData}
            rowsPerPage={20}
            onRefresh={refreshData}
          />
        </div>
      </div>
    </div>
  );
}
