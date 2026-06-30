// 📂 FILE: NhomSanLuongCard.tsx
"use client";
import React from "react";
import { GroupHeader } from "./GroupHeader";

interface NhomCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  total?:number;
}

export const NhomSanLuongCard: React.FC<NhomCardProps> = ({
  title,
  icon,
  children,
  total
}) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-4 border border-gray-100 flex flex-col h-full">
      {/* Tiêu đề nhóm */}
      <div className="flex justify-between items-center">
        {/* <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider">
          <span>{icon}</span> {title}
        </h3>
        {total && total > 0 && (
          <div title={`Tổng doanh thu ${title}: ${formatMoney(String(total) || "0")}`} className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shadow-sm text-base font-bold font-mono tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse font-sans"></span>
            {formatMoney(String(total) || "0")}{" "}
            
          </div>
        )} */}
        <GroupHeader icon={icon} title= {title} total={total}/>
      </div>
      {/* Danh sách các ô nhập liệu được truyền từ ngoài vào */}
      <div className="space-y-2 flex-1">
        {children}
      </div>
    </div>
  );
};
