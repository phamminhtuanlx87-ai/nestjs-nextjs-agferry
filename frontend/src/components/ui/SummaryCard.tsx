"use client";
import React, { ReactNode } from "react";

type SummaryCardProps = {
  title: string;
  value: number;
  subtile?: string;
  change?: string; // +6%
  description?: string; // so với tháng trước
  color: string;
  progressbar?: number;
  onClick?: () => void;
  icon?: ReactNode;
};

export default function SummaryCard({
  title,
  value,
  subtile,
  change,
  description,
  color,
  progressbar = 0,
  icon,
  onClick,
}: SummaryCardProps) {
  return (
    <div>
      <div>
        <div
          className={`text-white p-6 rounded-2xl shadow-lg hover:scale-[1.02] 
            transition-all duration-300 flex flex-col justify-between h-48 cursor-pointer
            ${color}`}
            onClick={onClick}
        >
          {/* <!-- Top --> */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80 line-clamp-1" title={title}>{title}</p>
              <h2 className="text-3xl font-bold mt-1">{value}</h2>
              <p className="text-xs opacity-70 mt-1 ">{subtile}</p>
            </div>
            {icon}
          </div>

          {/* <!-- Progress --> */}
          {progressbar > 0 && (
            <div className="mt-4">
              <div className="w-full bg-white/20 h-2 rounded-full">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressbar}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* <!-- Footer --> */}
          <div className="flex lg:flex-col lg:items-start xl:flex-row justify-between items-center mt-auto pt-3 border-t border-white/10 gap-2">
            {/* Khối hiển thị số lượng tăng giảm dạng Badge */}
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                change?.includes("+") && change !== "+0"
                  ? "bg-green-300/20 text-white"
                  : change?.includes("-")
                    ? "bg-red-500/20 text-red-300"
                    : "bg-white/10 text-slate-300"
              }`}
            >
              {change}
            </span>

            {/* Khối hiển thị thời gian cập nhật */}
            <span className="text-[11px] opacity-60 italic font-light tracking-wide">
              {description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
