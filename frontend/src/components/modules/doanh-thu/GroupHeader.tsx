// 📂 FILE: GroupHeader.tsx
"use client";
import { formatMoney } from "@/utils/formatnumber";
import React from "react";

interface NhomCardProps {
  title: string;
  icon: string;
  total?: number;
}

export const GroupHeader: React.FC<NhomCardProps> = ({
  title,
  icon,
  total,
}) => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Tiêu đề nhóm */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider">
          <span>{icon}</span> {title}
        </h3>
        {total && total > 0 ? (
          <div
            title={`Tổng doanh thu ${title}: ${formatMoney(String(total))} đ`}
            className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-lg font-bold font-mono tracking-wide"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse font-sans"></span>
            {formatMoney(String(total))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
