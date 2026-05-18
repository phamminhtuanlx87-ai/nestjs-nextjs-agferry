"use client";
import DSCongTrinh from "@/components/modules/cong-trinh/DSCongTrinh";
import ProjectStatsBlock from "@/components/modules/cong-trinh/ProjectStatsBlock";
import React, { useState } from "react";

export default function TongQuanPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
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
        />
        <DSCongTrinh
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}
