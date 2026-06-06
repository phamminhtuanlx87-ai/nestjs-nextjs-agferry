"use client";
import HoSoTable from "@/components/modules/ho-so/HoSoTable";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useCongTrinhData } from "@/hooks/useCongTrinhData";
import React from "react";

export default function HoSoPage() {
  const {
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    dsCongTrinh,
    loading,
  } = useCongTrinhData();

  if (loading) return <LoadingScreen />;
  return (
    <div>
      <div className="mb-6">
        <DynamicBreadcrumb />
      </div>
      <HoSoTable
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        data={dsCongTrinh}
        loading={loading}
        rowsPerPage={10}
        active={true}
      />
    </div>
  );
}
