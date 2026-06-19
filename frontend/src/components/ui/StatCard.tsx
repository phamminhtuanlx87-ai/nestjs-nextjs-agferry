"use client";

import React from "react";
import { motion } from "framer-motion";

// Định nghĩa các cổng nhận dữ liệu (Props) cho Card
interface StatCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  hoverBorderColor: string;
  value: string | number;
  value2?: string | number;
  unit?: string;
  footer: React.ReactNode;
  backdropSvg?: React.ReactNode;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  icon,
  iconBgColor,
  hoverBorderColor,
  value,
  value2,
  unit = "đ",
  footer,
  backdropSvg,
  onClick,
}) => {
  return (
    <motion.div
      layout
      id={id}
      onClick={onClick}
      className={`bg-white border border-slate-200/80 rounded-xl p-4.5 relative overflow-hidden shadow-xs group w-full h-full ${hoverBorderColor}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 z-10 relative">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
          {title}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center border ${iconBgColor}`}
        >
          {icon}
        </div>
      </div>

      {/* Main Value */}
      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans z-10 relative flex items-baseline gap-0.5">
        {typeof value === "number"
          ? new Intl.NumberFormat("vi-VN").format(value)
          : value}
        <span className="text-base font-bold text-slate-900 ml-0.5">
          {unit}
        </span>
      </h3>
      {!!value2 && Number(value2) > 0 && (
        <div className=" text-xs text-slate-500 mt-3 flex lg:flex-col xl:flex-row justify-self-start gap-1">
          <span>Trong đó CP Xây dựng:</span>
          <span className="font-semibold text-slate-700">
            {new Intl.NumberFormat("vi-VN").format(Number(value2))}
            <span className="ml-0.5 font-medium">{unit}</span>
          </span>
        </div>
      )}
      {/* Footer chứa thông tin phụ */}
      <div className="flex lg:flex-col lg:items-start xl:flex-row items-center gap-1.5 mt-3.5 z-10 relative">
        {footer}
      </div>

      {/* Hình vẽ mờ trang trí phía sau nền */}
      {backdropSvg && (
        <div className="absolute bottom-1 right-2 pointer-events-none group-hover:scale-110 transition-transform duration-300">
          {backdropSvg}
        </div>
      )}
    </motion.div>
  );
};
