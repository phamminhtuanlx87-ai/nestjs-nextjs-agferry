"use client";
import SanLuongStatCard from "./SanLuongStatCard";
import { TQSanLuongRes } from "../custom-hook/useTQSanLuong";
import { formatCurrency } from "@/utils/formatnumber";
// Định nghĩa props nhận từ page.tsx gửi xuống
interface SanLuongCardProps {
  dulieu: TQSanLuongRes | null;
  isLoading: boolean;
  error: string | null;
}

const SanLuongCard = ({ dulieu }: SanLuongCardProps) => {
  const benDoanhThuCaoNhat = dulieu?.benCaoNhat;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
        <SanLuongStatCard
          title="Tổng doanh thu"
          value={formatCurrency(dulieu?.tongDoanhThu || "0")}
          unit="đ"
          iconType="blue"
          trend={dulieu?.trends?.tongDoanhThu}
        />

        <SanLuongStatCard
          title="Tổng lượt Xe các loại"
          value={formatCurrency(dulieu?.tongLuotXeCacLoai || "0")}
          unit="lượt"
          iconType="green"
           trend={dulieu?.trends?.tongLuotXeCacLoai}
        />

        <SanLuongStatCard
          title="Tổng lượt Hành Khách"
          value={formatCurrency(dulieu?.tongLuotHanhKhach || "0")}
          unit="lượt"
          iconType="orange"
          trend={dulieu?.trends?.tongLuotHanhKhach}
        />

        <SanLuongStatCard
          title="Tổng lượt Thuê bao phà"
          value={formatCurrency(dulieu?.tongLuotThueBao || "0")}
          unit="lượt"
          iconType="ferry"
          trend={dulieu?.trends?.tongLuotThueBao}
        />

        <SanLuongStatCard
          title="Tổng lượt Vé định kỳ"
          value={formatCurrency(dulieu?.tongLuotVeDinhKy || "0")}
          unit="lượt"
          iconType="purple"
          trend={dulieu?.trends?.tongLuotVeDinhKy}
        />

        <SanLuongStatCard
          title={"Bến doanh thu cao nhất"}
          value={benDoanhThuCaoNhat?.ma_ben || ""}
          subValue={benDoanhThuCaoNhat?.doanh_thu || ""}
          iconType="yellow"
          trend={dulieu?.trends?.benCaoNhat}
        />
      </div>
    </div>
  );
};

export default SanLuongCard;
