"use client";
import React from "react";

export interface CompareFilters {
  type?: string;
  percentage?: string;
  text?: string;
}

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  subValue?: string;
  trend?: CompareFilters;
  iconType: "blue" | "green" | "orange" | "purple" | "yellow" | "ferry";
}

export default function SanLuongStatCard({
  title,
  value,
  unit,
  subValue,
  trend,
  iconType,
}: StatCardProps) {
  // Cấu hình màu sắc cho vòng tròn icon dựa trên iconType
  const iconStyles = {
    blue: "bg-[#f0f4ff] text-[#1d4ed8] fill-[#1d4ed8]",
    green: "bg-[#f0fdf4] text-[#15803d] fill-[#15803d]",
    orange: "bg-[#fff7ed] text-[#ea580c] fill-[#ea580c]",
    purple: "bg-[#faf5ff] text-[#7e22ce] fill-[#7e22ce]",
    yellow: "bg-[#fefce8] text-[#ca8a04] fill-[#ca8a04]",
    ferry: "bg-[#e0f7fa] text-[#00838f] fill-[#00838f]",
  };

  // Các icon SVG tương ứng
  const renderIcon = () => {
    switch (iconType) {
      case "blue":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path d="M12 6a3 3 0 0 0-3 3c0 .73.22 1.34.61 1.83L8 13.5A1.5 1.5 0 0 0 9.5 15h5a1.5 1.5 0 0 0 1.5-1.5l-1.61-2.67c.39-.49.61-1.1.61-1.83a3 3 0 0 0-3-3zm0 1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z" />
          </svg>
        );
      case "green":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path d="M18.5 9h-13l.8-2.4A1.5 1.5 0 0 1 7.74 5.5h8.52a1.5 1.5 0 0 1 1.44 1.1l.8 2.4zM4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H6v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm3.5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        );
      case "orange":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path d="M12 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-5.5 6c0-2.5 3-3.5 5.5-3.5s5.5 1 5.5 3.5V18h-11v-1z" />
          </svg>
        );
      case "purple":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path d="M7 5a2 2 0 0 1 2-2h5l4 4v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5zm7 0v3h3l-3-3zm-4 6h6v1h-6v-1zm0 3h6v1h-6v-1z" />
          </svg>
        );
      case "yellow":
        return (
          <svg className="w-7 h-7" viewBox="0 0 24 24">
            <path d="M17 5V4H7v1H4v3c0 2.2 1.8 4 4 4h1a4 4 0 0 0 3.4 3.9V18H10a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2h-2.4v-2.1A4 4 0 0 0 15 12h1c2.2 0 4-1.8 4-4V5h-3z" />
          </svg>
        );
      case "ferry":
        return (
          <svg
            className="w-7 h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Mái che / Buồng lái */}
            <path d="M6 10h12M9 10V6h6v4" />
            {/* Thân phà */}
            <path d="M3 14h18l-2 5H5z" />
            {/* Mặt nước / Sóng biển nhỏ phía dưới */}
            <path d="M2 21a2.5 2.5 0 0 0 4 0 2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 0 4 0 2.5 2.5 0 0 1 4 0 2.5 2.5 0 0 0 4 0" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-start gap-4 flex-1 min-w-62.5 card-soft">
      {/* Vòng tròn Icon */}
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${iconStyles[iconType]}`}
      >
        {renderIcon()}
      </div>

      {/* Nội dung chữ */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[11px] font-bold text-[#1e293b] tracking-wider uppercase m-0">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-[#0f172a] m-0">
          {value}
          {unit && (
            <span className="text-sm font-medium text-[#475569] ml-0.5">
              {unit}
            </span>
          )}
        </h3>

        {/* Nếu có tiểu mục (dành riêng cho Card Bến xe) */}
        {subValue && (
          <p className="m-0 text-[15px] font-semibold text-[#334155]">
            {subValue}
          </p>
        )}

        {/* Xu hướng tăng / giảm */}
        {trend && (
          <p className="m-0 text-xs font-bold flex items-center gap-1 mt-2">
            <span
              className={`inline-flex items-center gap-1 ${
                trend.type === "up"
                  ? "text-emerald-600"
                  : trend.type === "down"
                    ? "text-rose-600"
                    : "text-slate-500"
              }`}
            >
              {/* Biểu tượng xu hướng */}
              {trend.type === "up" ? "▲" : trend.type === "down" ? "▼" : "—"}

              {/* Tỷ lệ phần trăm */}
              <span className="ml-1">{trend.percentage}</span>
            </span>

            {/* Phần chữ giải thích màu xám nằm ngoài vùng màu của mũi tên */}
            <span className="font-normal text-slate-400"> {trend.text}</span>
          </p>
        )}
      </div>
    </div>
  );
}
