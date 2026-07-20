"use client";
import { ComboChartResponse } from "../../custom-hook/charts/useDuLieuComboChart";
import { TyTrongChartResponse } from "../../custom-hook/charts/useDuLieuTyTrongChart";
import { FilterToolbarDto } from "../../custom-hook/useTQSanLuong";
import SanLuongDoanhThuComboChart from "./SanLuongDoanhThuComboChart";
import SanLuongTyTrongChart from "./SanLuongTyTrongChart";

interface SanLuonChartProps {
  readonly duLieuComboChart?: ComboChartResponse | null;
  readonly duLieuTyTrongChart?: TyTrongChartResponse | null;
  readonly filters: FilterToolbarDto;
}

const SanLuongChartSection = ({
  duLieuComboChart,
  duLieuTyTrongChart,
  filters,
}: SanLuonChartProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <SanLuongDoanhThuComboChart
        duLieuComboChart={duLieuComboChart}
        filters={filters}
      />
      <SanLuongTyTrongChart
        duLieuTyTrongChart={duLieuTyTrongChart}
        filters={filters}
      />
    </div>
  );
};

export default SanLuongChartSection;
