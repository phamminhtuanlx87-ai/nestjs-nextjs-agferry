// 📂 FILE: VatSelectComponent.tsx
"use client";
import { formatMoney } from "@/utils/formatnumber";
import React, { forwardRef } from "react";

interface VatSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  value?: number;
  isFirst?: boolean;
  vatThanhTien?: number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const VatSelectComponent = forwardRef<HTMLSelectElement, VatSelectProps>(
  (
    {
      label,
      error,
      className = "",
      value = 8,
      isFirst = false,
      vatThanhTien = 0,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = props.name || props.id;

    // Xử lý sự kiện khi chọn phần trăm thuế
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        // Trả về số nguyên chuẩn (8 hoặc 10) về cho React Hook Form
        onChange(e);
      }
    };

    return (
      <div className="w-full flex flex-col">
        <div className="w-full">
          {/* TIÊU ĐỀ CỘT CỐ ĐỊNH (Nếu cần hiển thị khi đứng đầu nhóm) */}
          {isFirst && (
            <div className="hidden md:grid grid-cols-12 gap-3 pb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1.5 text-center mt-2 first:mt-0">
              <div className="col-span-5 text-left">Chủng loại xe</div>
              <div className="col-span-2 text-right">Sản lượng / Thuế</div>
              <div className="col-span-2 text-right">Đơn giá</div>
              <div className="col-span-3 text-right">Thành tiền</div>
            </div>
          )}

          {/* DÒNG HIỂN THỊ THUẾ VAT */}
          <div className="grid grid-cols-12 gap-3 items-center w-full py-1.5 border-b border-gray-50 last:border-0 hover:bg-slate-50/60 rounded px-1 transition-colors">
            {/* Tên danh mục */}
            <div className="col-span-12 md:col-span-5 flex items-center space-x-1">
              <span
                className="text-sm font-medium text-gray-600 dark:text-gray-200 truncate block max-w-[95%]"
                title={label}
              >
                {label}
              </span>
            </div>

            {/* Cụm điều khiển */}
            <div className="col-span-12 md:col-span-7 grid grid-cols-7 gap-2 items-center">
              {/* Dropdown Chọn Thuế Suất (Nằm đúng vị trí cột Sản lượng cũ) */}
              <div className="col-span-3 md:col-span-2">
                <span className="block md:hidden text-[10px] text-gray-400 font-bold mb-0.5">
                  Mức thuế
                </span>
                <select
                  id={inputId}
                  ref={ref}
                  value={value}
                  onChange={handleSelectChange}
                  {...props}
                  className={`w-full py-1 px-2 border rounded text-right text-sm font-semibold bg-slate-50 focus:bg-white outline-none cursor-pointer transition-all pr-1
                    ${error ? "border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-100" : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm"}
                    ${className}
                  `}
                >
                  <option value={8}>8 %</option>
                  <option value={10}>10 %</option>
                </select>
              </div>

              {/* Đơn giá (Thuế không có đơn giá lẻ nên để gạch ngang đúng chuẩn kế toán) */}
              <div className="col-span-2 md:col-span-2 text-center md:text-right text-xs md:text-sm text-gray-400 font-semibold">
                <span className="block md:hidden text-xs text-gray-400 font-bold mb-0.5">
                  Đơn giá
                </span>
                <div></div>
              </div>

              {/* Thành tiền (Số tiền thuế tổng được tính gộp dưới Summary nên ở đây hiển thị 0 đ) */}
              <div className="col-span-2 md:col-span-3 text-right text-sm font-bold text-amber-600">
                <span className="block md:hidden text-xs text-gray-400 font-bold mb-0.5">
                  Thành tiền
                </span>
                {/* 🌟 Thay đổi từ "0 đ" cố định thành số tiền động được format đẹp đẽ */}
                <div className="pr-1 truncate">
                  {formatMoney(String(vatThanhTien || 0))}
                </div>
              </div>
            </div>
          </div>

          {/* Hiển thị lỗi Validation nếu có */}
          {error && (
            <span className="text-xs text-red-500 font-medium px-1 mt-0.5">
              ⚠️ {error}
            </span>
          )}
        </div>
      </div>
    );
  },
);

VatSelectComponent.displayName = "VatSelectComponent";
export default VatSelectComponent;
