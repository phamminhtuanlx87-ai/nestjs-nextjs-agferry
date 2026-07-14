"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ComboChartResponse } from "../../custom-hook/charts/useDuLieuComboChart";
import { useMemo } from "react";
import {
  MAPPING_BEN_PHA_FIELD,
  MAPPING_THOI_GIAN_COMBO_CHART,
} from "@/services/sanLuongService";
import { FilterToolbarDto } from "../../custom-hook/useTQSanLuong";
import dayjs from "dayjs";

interface SanLuongDoanhThuChartItem {
  thoiGian?: string;
  nhomSanLuong?: string;
  sanLuong: number;
  doanhThu: number;
}

interface DuLieuChartProps {
  readonly duLieuComboChart?: ComboChartResponse | null;
  readonly filters: FilterToolbarDto;
}

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

const formatCompactCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${formatNumber(value / 1_000_000_000)} tỷ`;
  }

  if (value >= 1_000_000) {
    return `${formatNumber(value / 1_000_000)} triệu`;
  }

  return `${formatNumber(value)} đ`;
};

const SanLuongDoanhThuComboChart = ({
  duLieuComboChart,
  filters,
}: DuLieuChartProps) => {
  const filerLable = (label: string) => {
    if (label === "HOM_NAY") {
      const now = dayjs();
      return (
        MAPPING_THOI_GIAN_COMBO_CHART[
          label as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
        ] +
        " " +
        dayjs(now).format("DD/MM/YYYY")
      );
    }
    return MAPPING_THOI_GIAN_COMBO_CHART[
      label as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
    ];
  };
  // 2. Chuyển đổi dữ liệu từ duLieuComboChart sang mảng chartData chuẩn cấu trúc của bạn
  const chartData: SanLuongDoanhThuChartItem[] = useMemo(() => {
    // Bẫy logic an toàn: Nếu API chưa trả về hoặc mảng rỗng, trả về mảng rỗng ngay để tránh lỗi crash trang
    if (!duLieuComboChart) {
      return [];
    }

    // Thực hiện map từng phần tử từ API sang kiểu cấu trúc mong muốn
    return duLieuComboChart.du_lieu?.map((item) => ({
      nhomSanLuong: item.nhan, // API "nhan" -> "thoiGian" (Ví dụ: "20/07")
      sanLuong: Number(item.san_luong) || 0, // Ép từ string sang number, tránh bẫy NaN tài chính
      doanhThu: Number(item.doanh_thu) || 0, // Ép từ string sang number, bảo toàn sổ sách
    }));
  }, [duLieuComboChart]); // Chỉ tính toán lại khi cục dữ liệu từ API thay đổi
  const isChuaCoDuLieu =
    !duLieuComboChart || duLieuComboChart?.du_lieu.length === 0;

  return (
    <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-4 min-h-80 card-soft">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
          Biểu đồ sản lượng và doanh thu -{" "}
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-full border border-blue-100">
            {filters?.time &&
            MAPPING_THOI_GIAN_COMBO_CHART[
              filters.time as keyof typeof MAPPING_THOI_GIAN_COMBO_CHART
            ]
              ? filerLable(filters?.time)
              : ""}
          </span>
          {/* 2. Trạng thái Phạm vi bến (Đảm bảo đồng bộ chuẩn mã ALL hoặc TAT_CA_BEN theo service của bạn) */}
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-100">
            {filters?.location &&
            MAPPING_BEN_PHA_FIELD[
              filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
            ]
              ? MAPPING_BEN_PHA_FIELD[
                  filters.location as keyof typeof MAPPING_BEN_PHA_FIELD
                ]
              : "Tất cả bến phà"}
          </span>
        </h3>
        <p className="text-xs text-slate-400">
          Cột biểu thị sản lượng, đường biểu thị doanh thu theo thời gian.
        </p>
      </div>

      <div className="h-72 w-full">
        {isChuaCoDuLieu ? (
          <div className="w-full h-full p-10 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400 text-sm">
            🚫 Không tìm thấy dữ liệu báo cáo phù hợp.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={chartData}
              margin={{ top: 12, right: 12, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="nhomSanLuong"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="sanLuong"
                name="sanLuong"
                orientation="left"
                tickFormatter={formatNumber}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <YAxis
                yAxisId="doanhThu"
                orientation="right"
                name="doanhThu"
                tickFormatter={formatCompactCurrency}
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <Tooltip
                formatter={(value, name) => {
                  console.log("Recharts Name:", name, "Value:", value);

                  const isDoanhThu =
                    String(name).toLowerCase().includes("doanh") 
                  if (isDoanhThu) {
                    return [`${formatNumber(Number(value))} đ`, "Doanh thu"];
                  }

                  return [`${formatNumber(Number(value))} lượt`, "Sản lượng"];
                }}
              />
              <Legend verticalAlign="top" height={28} />
              <Bar
                yAxisId="sanLuong"
                dataKey="sanLuong"
                name="Sản lượng"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                barSize={28}
              />
              <Line
                yAxisId="doanhThu"
                type="monotone"
                dataKey="doanhThu"
                name="Doanh thu"
                stroke="#16A34A"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SanLuongDoanhThuComboChart;
