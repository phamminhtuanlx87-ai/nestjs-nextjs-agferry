// 📂 FILE: components/NhomSanLuongCard.tsx
"use client";
import React from "react";

interface NhomCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

export const NhomSanLuongCard: React.FC<NhomCardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm space-y-4 border border-gray-100 flex flex-col h-full">
      {/* Tiêu đề nhóm */}
      <h3 className="font-bold text-gray-700 flex items-center gap-2 border-b pb-2 uppercase text-sm tracking-wider">
        <span>{icon}</span> {title}
      </h3>
      
      {/* Danh sách các ô nhập liệu được truyền từ ngoài vào */}
      <div className="space-y-2 flex-1">
        {children}
      </div>
    </div>
  );
};