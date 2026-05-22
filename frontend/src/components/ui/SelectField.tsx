"use client";
import { RiArrowDownSLine } from "@remixicon/react";
import React, { forwardRef } from "react";

// 1. Thêm prop 'error' vào Interface
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string; // Prop nhận thông báo lỗi từ Hook Form
}

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, ...props }, ref) => {
    const selectId = props.name || props.id;
    return (
      <div className="flex flex-col w-full gap-3">
        <label
          htmlFor={selectId}
          className="text-shadow-sm text-gray-500  font-semibold dark:text-gray-200"
        >
          {label}
        </label>
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            {...props}
            // 2. Nếu có lỗi thì viền đổi sang màu đỏ
            className={`border appearance-none w-full h-11 px-3 pr-10 outline-none transition-all cursor-pointer ${
              error ? "border-red-500" : "border-gray-300"
            } px-3 py-2 input-primary rounded`}
          >
            <option value="">-- Chọn {label} --</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* 3. Chèn Icon mũi tên tự chế vào đây */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <RiArrowDownSLine size={20} className="text-gray-600" />
          </div>
        </div>
        {/* 3. Hiển thị thông báo lỗi ngay dưới Select */}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

// 4. Khắc phục lỗi Missing display name
SelectField.displayName = "SelectField";
