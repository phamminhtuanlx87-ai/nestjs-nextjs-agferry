'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Định nghĩa các cổng nhận dữ liệu (Props) cho Card
interface StatCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  hoverBorderColor: string;
  value: string | number;
  unit?: string;
  footer: React.ReactNode;
  backdropSvg?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  icon,
  iconBgColor,
  hoverBorderColor,
  value,
  unit = 'đ',
  footer,
  backdropSvg,
}) => {
  return (
    <motion.div
      layout
      id={id}
      className={`bg-white border border-slate-200/80 rounded-xl p-4.5 relative overflow-hidden shadow-xs group transition w-full h-40 ${hoverBorderColor}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 z-10 relative">
        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide">
          {title}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${iconBgColor}`}>
          {icon}
        </div>
      </div>

      {/* Main Value */}
      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans z-10 relative flex items-baseline gap-0.5">
        {typeof value === 'number' ? new Intl.NumberFormat('vi-VN').format(value) : value}
        <span className="text-base font-bold text-slate-900 ml-0.5">{unit}</span>
      </h3>

      {/* Footer chứa thông tin phụ */}
      <div className="flex items-center gap-1.5 mt-3.5 z-10 relative">
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