"use client";
import React from "react";

export function VnptWarningFooter() {
  return (
    <div className="mt-3 w-full bg-slate-100 rounded-xl border border-slate-200/60 p-4 shadow-sm transition-all">
      <div className="flex flex-col items-center text-center justify-center gap-2">
        
        {/* Khối giả lập Logo VNPT iOffice chuyên nghiệp */}
        <div className="flex items-center gap-1.5 select-none mb-1">
          {/* Biểu tượng quả địa cầu xanh VNPT */}
          <div className="w-5 h-5 rounded-full bg-linear-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-sm">
            <div className="w-3.5 h-1 border border-white rounded-full rotate-[-25deg]" />
          </div>
          <span className="text-xs font-black text-blue-600 tracking-tight">VNPT</span>
          <span className="text-xs font-bold text-amber-600 tracking-tight">iOffice</span>
        </div>

        {/* Đoạn text thông báo phân tách dòng tránh tràn màn hình */}
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-slate-600 leading-tight">
            Để xem nội dung tài liệu, vui lòng đăng nhập hệ thống:
          </span>
          <a
            href="https://angiang.vnptioffice.vn/vpdt/main?lang=vi"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-bold text-blue-500 hover:text-blue-700 underline underline-offset-4 decoration-2 breakdown-all transition-colors"
          >
            angiang.vnptioffice.vn
          </a>
        </div>

      </div>
    </div>
  );
}