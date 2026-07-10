"use client";
import SanLuongStatCard from "./SanLuongStatCard";
import { TQSanLuongRes } from "../custom-hook/useTQSanLuong";
import { formatCurrency } from "@/utils/formatnumber";
// Định nghĩa props nhận từ page.tsx gửi xuống
interface SanLuongCardProps {
  duLieuKPI: TQSanLuongRes | null;
}

const SanLuongCard = ({ duLieuKPI }: SanLuongCardProps) => {
  const benDoanhThuCaoNhat = duLieuKPI?.benCaoNhat;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
        <SanLuongStatCard
          title="Tổng doanh thu"
          value={formatCurrency(duLieuKPI?.tongDoanhThu ?? "0")}
          unit="đ"
          iconType="blue"
          trend={duLieuKPI?.trends?.tongDoanhThu}
        />

        <SanLuongStatCard
          title="Tổng lượt Xe các loại"
          value={formatCurrency(duLieuKPI?.tongLuotXeCacLoai ?? "0")}
          unit="lượt"
          iconType="green"
          trend={duLieuKPI?.trends?.tongLuotXeCacLoai}
        />

        <SanLuongStatCard
          title="Tổng lượt Hành Khách"
          value={formatCurrency(duLieuKPI?.tongLuotHanhKhach ?? "0")}
          unit="lượt"
          iconType="orange"
          trend={duLieuKPI?.trends?.tongLuotHanhKhach}
        />

        <SanLuongStatCard
          title="Tổng lượt Thuê bao phà"
          value={formatCurrency(duLieuKPI?.tongLuotThueBao ?? "0")}
          unit="lượt"
          iconType="ferry"
          trend={duLieuKPI?.trends?.tongLuotThueBao}
        />

        <SanLuongStatCard
          title="Tổng lượt Vé định kỳ"
          value={formatCurrency(duLieuKPI?.tongLuotVeDinhKy ?? "0")}
          unit="lượt"
          iconType="purple"
          trend={duLieuKPI?.trends?.tongLuotVeDinhKy}
        />

        <SanLuongStatCard
          title={"Bến doanh thu cao nhất"}
          value={benDoanhThuCaoNhat?.ma_ben ?? ""}
          subValue={formatCurrency(benDoanhThuCaoNhat?.doanh_thu ?? "0") + " đ"}
          iconType="yellow"
          trend={duLieuKPI?.trends?.benCaoNhat}
        />
      </div>
    </div>
  );
};

export default SanLuongCard;
