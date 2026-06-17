"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalItems?: number; // Truyền thêm tổng số item nếu muốn hiển thị text phụ
  itemsPerPage?: number;
}

export default function ResponsivePagination({
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems = 0,
  itemsPerPage = 5,
}: PaginationProps) {
  console.log(totalItems);
  console.log(totalPages);
  if (totalPages <= 1) return null;

  // Tính toán toán số lượng hiển thị để làm text thông báo
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 px-2 border-t border-slate-100 mt-4">
      {/* 1. Phần text thông báo bên trái - Đảm bảo text không bị bóp nghẹt */}
      {totalItems > 0 && (
        <p className="text-[12px] font-medium text-slate-500 whitespace-nowrap">
          Hiển thị{" "}
          <span className="font-semibold text-slate-700">
            {startItem}-{endItem}
          </span>{" "}
          trong số{" "}
          <span className="font-semibold text-slate-700">{totalItems}</span>{" "}
          công trình
        </p>
      )}

      {/* 2. Cụm nút bấm phân trang */}
      <div className="flex items-center gap-1.5 select-none">
        {/* Nút Quay lại (‹) */}
        <button
          type="button"
          className="cursor-pointer w-8 h-8 flex items-center justify-center text-sm font-medium border border-slate-200 text-slate-600 bg-white rounded-lg hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors shadow-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ‹
        </button>

        {/* Giao diện trên MOBILE: Hiển thị text rút gọn "1 / 3" chống bể khung hình */}
        <div className="flex sm:hidden items-center justify-center px-3 h-8 border border-slate-200/80 bg-slate-50/50 rounded-lg text-xs font-bold text-slate-600">
          Trang {currentPage} / {totalPages}
        </div>

        {/* Giao diện trên DESKTOP: Hiển thị đầy đủ dãy số nút bấm */}
        <div className="hidden sm:flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const isActive = currentPage === pageNum;

            return (
              <button
                key={i}
                type="button"
                className={`cursor-pointer w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg border transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 active:bg-slate-100"
                }`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Nút Kế tiếp (›) */}
        <button
          type="button"
          className="cursor-pointer w-8 h-8 flex items-center justify-center text-sm font-medium border border-slate-200 text-slate-600 bg-white rounded-lg hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors shadow-sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
