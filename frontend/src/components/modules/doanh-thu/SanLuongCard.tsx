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
       
        <GroupHeader icon={icon} title= {title} total={total}/>
      </div>
      {/* Danh sách các ô nhập liệu được truyền từ ngoài vào */}
      <div className="space-y-2 flex-1">
        {children}
      </div>
    </div>
  );
};
