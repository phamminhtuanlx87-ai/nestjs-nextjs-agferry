// 📂 FILE: components/ThanhTongHopDoanhThu.tsx
"use client";
import React from "react";
import { formatMoney } from "@/utils/formatnumber";
import Button from "@/components/ui/Button";

interface ThanhTongHopProps {
  tongDoanhThu: number;
  isSubmitting?: boolean;
  onSave?: () => void;
}

export const ThanhTongHopDoanhThu: React.FC<ThanhTongHopProps> = ({ 
  tongDoanhThu, 
  isSubmitting = false, 
  onSave 
}) => {
  return (
    <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
      <div className="text-center sm:text-left">
        <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">
          Tổng cộng doanh thu dự kiến
        </span>
        <span className="text-2xl font-black text-blue-900 truncate transition-all">
          {formatMoney(String(tongDoanhThu))}
        </span>
      </div>
      
      <Button 
        onClick={onSave}
        variant="primary"
        disabled={isSubmitting}
        className="w-full sm:w-auto text-white font-bold px-8 py-3 rounded-md active:scale-[0.98] transition-all disabled:bg-gray-400 shadow-sm"
      >
        {isSubmitting ? "Đang lưu dữ liệu..." : "Lưu dữ liệu"}
      </Button>
    </div>
  );
};