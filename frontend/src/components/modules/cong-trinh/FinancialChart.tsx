"use client";

import { ICongTrinh } from "@/services/congTrinhService";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 1. Dữ liệu thô (Mock Data) theo cấu trúc các tháng

interface ChartPros {
  dsCongTrinh: ICongTrinh[];
}

const FinancialChart = ({ dsCongTrinh}: ChartPros) => {
  const [isMounted, setIsMounted] = useState(false);

  // Hàm định dạng hiển thị tiền tệ VNĐ khi rê chuột vào cột (Tooltip)
  const formatCurrency = (value: number) => {
    const num = Number(value);

    // Nếu số tiền từ 1 Tỷ trở lên (1.000.000.000 đ)
    if (num >= 1000000000) {
      const tỷ = num / 1000000000;
      // Lấy 2 số thập phân sau dấu phẩy (ví dụ: 12.5 Tỷ đồng), nếu là số tròn thì tự rút gọn
      return `${parseFloat(tỷ.toFixed(2))} Tỷ đồng`;
    }

    // Nếu nhỏ hơn 1 Tỷ thì hiển thị bình thường: 100.000.000 đ
    return new Intl.NumberFormat("vi-VN").format(num) + " đ";
  };

  // 1. Khởi tạo mảng 12 tháng trống với giá trị bằng 0
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const monthNum = index + 1;
    return {
      month: `T${monthNum < 10 ? "0" : ""}${monthNum}`, // Sinh ra T01, T02, ..., T12
      "Dự toán": 0,
      "Quyết toán": 0,
    };
  });

  // 2. Duyệt qua danh sách công trình từ props để cộng dồn tiền vào từng tháng tương ứng
  dsCongTrinh?.forEach((item) => {
    // Giả định trường dữ liệu ngày tháng của bạn là updatedAt hoặc ngày tạo, bạn thay tên trường cho đúng nhé

    const duToanDateString =
      item.giai_doan[7]?.ngay_thuc_hien ?? item.giai_doan[2]?.ngay_thuc_hien;

    const quyetToanDateString = item.giai_doan[8]?.ngay_thuc_hien;
    // 2. Nếu một trong hai giai đoạn có dữ liệu thì mới tiến hành xử lý tiếp
    if (duToanDateString) {
      const duToanDate = new Date(duToanDateString as string);

      // Logic xử lý tiếp theo của bạn (ví dụ tính tháng, cộng dồn tiền...)
      const duToanMonthIndex = duToanDate.getMonth();
      if (duToanMonthIndex >= 0 && duToanMonthIndex < 12) {
        const duToanString =
          item.giai_doan[7]?.tong_gia_tri ?? item.giai_doan[2]?.tong_gia_tri;
        monthlyData[duToanMonthIndex]["Dự toán"] += Number(duToanString || 0);
      }
    }

    if (quyetToanDateString) {
      const quyetToanDate = new Date(quyetToanDateString as string);

      // Logic xử lý tiếp theo của bạn (ví dụ tính tháng, cộng dồn tiền...)
      const quyetToanMonthIndex = quyetToanDate.getMonth();
      if (quyetToanMonthIndex >= 0 && quyetToanMonthIndex < 12) {
        const duToanString =
          item.giai_doan[7]?.tong_gia_tri ?? item.giai_doan[2]?.tong_gia_tri;
        monthlyData[quyetToanMonthIndex]["Quyết toán"] += Number(
          duToanString || 0,
        );
      }
    }
  });
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Nếu chưa mount xong, trả về một div trống có chiều cao bằng đúng chiều cao truyền vào
  // Điều này giữ khung layout không bị giật nhảy khi chart xuất hiện
  if (!isMounted) {
    return (
      <div
        className={`w-full  h-28 min-h-28 mt-2 bg-slate-50/50 rounded-xl animate-pulse`}
      />
    );
  }
  return (
  <div className={`relative w-full mt-2 select-none h-28 min-h-28`}>
      <ResponsiveContainer
        width="100%"
        height={100}
      >
        <BarChart
          data={monthlyData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          barSize={35} // Độ rộng của cột đứng
        >
          {/* Trục X hiển thị tên các tháng T04, T05, T06 */}
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
            dy={4}
          />

          {/* Ẩn trục Y để biểu đồ thoáng đạt, nằm gọn gàng */}
          <YAxis hide domain={[0, "dataMax + 2000000000"]} />

          {/* Hộp thoại hiển thị thông tin chi tiết mượt mà khi di chuột */}
          <Tooltip
            formatter={(value, name) => [formatCurrency(Number(value)), name]}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
            cursor={{ fill: "transparent" }} // Ẩn vệt xám quét của Recharts
          />

          {/* Cột 1: Quyết toán nằm ở DƯỚI cùng (Màu cam đất/vàng giống mẫu) */}
          <Bar
            dataKey="Quyết toán"
            stackId="financialStack"
            fill="#e28743"
            radius={[0, 0, 4, 4]} // Bo góc nhẹ cạnh đáy
          />

          {/* Cột 2: Dự toán xếp CHỒNG lên trên (Màu xanh đậm đặc trưng hệ thống) */}
          {/* Sử dụng background={{ fill: '#eae9f1' }} để tạo máng xám nhạt bọc ngoài cột giống hệt thiết kế */}
          <Bar
            dataKey="Dự toán"
            stackId="financialStack"
            fill="#1e1b4b"
            radius={[6, 6, 0, 0]} // Bo tròn mạnh ở đỉnh trên cột giống ảnh
            background={{ fill: "#f1f1f6", radius: 6 }}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Bộ chú thích (Legend) tùy chỉnh nằm gọn phía dưới */}
      <div className="flex justify-center items-center gap-6 text-[11px] font-medium text-slate-500 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#1e1b4b] rounded-full"></span>
          <span>Dự toán</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-[#e28743] rounded-full"></span>
          <span>Quyết toán</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart;
