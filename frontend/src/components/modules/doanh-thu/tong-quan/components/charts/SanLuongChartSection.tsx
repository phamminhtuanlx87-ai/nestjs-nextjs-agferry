"use client";
import { ComboChartResponse } from "../../custom-hook/charts/useDuLieuComboChart";
import { FilterToolbarDto } from "../../custom-hook/useTQSanLuong";
import SanLuongDoanhThuComboChart from "./SanLuongDoanhThuComboChart";
import SanLuongTyTrongChart from "./SanLuongTyTrongChart";

interface SanLuonChartProps {
  readonly duLieuComboChart?: ComboChartResponse | null;
  readonly filters: FilterToolbarDto;
}

const SanLuongChartSection = ({
  duLieuComboChart,
  filters,
}: SanLuonChartProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <SanLuongDoanhThuComboChart
        duLieuComboChart={duLieuComboChart}
        filters={filters}
      />
      <SanLuongTyTrongChart />
    </div>
  );
};

export default SanLuongChartSection;
