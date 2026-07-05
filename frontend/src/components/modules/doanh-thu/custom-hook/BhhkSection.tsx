"use client";

import React from "react";
import { formatMoney } from "@/utils/formatnumber";

interface BhhkSectionProps {
  tongTienBhhk: number;
}

export const BhhkSection: React.FC<BhhkSectionProps> = ({ tongTienBhhk }) => {
  return (
    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-blue-500 text-white rounded-lg text-xl shadow-md shadow-blue-200">
          🛡️
        </div>
        <div>
          <h4 className="text-sm font-bold text-blue-900">Tổng cộng tiền Bảo hiểm Hành khách (BHHK)</h4>
          <p className="text-xs text-blue-600 mt-0.5">Số tiền bảo hiểm được trích xuất tự động dựa trên danh mục cấu hình năm.</p>
        </div>
      </div>
      <div className="text-right w-full md:w-auto">
        <span className="inline-block text-xl font-black text-blue-700 font-mono bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-inner min-w-40 text-center">
          {formatMoney(String(tongTienBhhk))} <span className="text-xs font-bold text-blue-500 ml-1">VND</span>
        </span>
      </div>
    </div>
  );
};