// 📂 FILE: InputSanLuong.tsx
"use client";
import { formatCurrency, formatMoney } from "@/utils/formatnumber";
import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  price: string;
  quantity?: string;
  isFirst?: boolean; // Nếu là dòng đầu tiên của NHÓM CON thì hiện Header cột
  maBen?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isHighlightPrice?: boolean;
}

const InputSanLuong = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className = "",
      price,
      quantity = "0",
      isFirst = false,
      maBen,
      isHighlightPrice = false,
      onChange,
      ...props
    },
    ref,
  ) => {
    const inputId = props.name || props.id;
    const thanhTien =
      Math.round(Number(quantity || 0) * (Number(price) || 0)) || 0;
    // Xử lý sự kiện khi người dùng gõ số ngay bên trong InputSanLuong
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 1. Loại bỏ toàn bộ ký tự không phải là số (giữ lại chuỗi số sạch, ví dụ: "17456")
      const rawValue = e.target.value.replace(/\D/g, "");

      // 2. Tạo chuỗi hiển thị có dấu chấm định dạng để đưa ra màn hình (ví dụ: "17.456")
      const formattedValue = formatCurrency(rawValue);

      if (onChange) {
        // 3. Ghi đè chuỗi số thuần túy (STRING) vào event target để Hook Form nhận dạng đúng chuẩn HTML
        e.target.value = rawValue;

        // 4. Kích hoạt onChange của React Hook Form
        onChange(e);

        // 5. Trả lại chuỗi định dạng dấu chấm ngay lập tức để hiển thị trên input cho người dùng
        e.target.value = formattedValue;
      }
    };
    return (
      <div className="w-full flex flex-col">
        <div
          key={maBen} // <-- Thêm key này vào, mỗi khi maBen đổi, React sẽ re-render khối này
          className="animate-[pulse_0.1s_ease-in-out]"
        >
          {/* 🌟 TIÊU ĐỀ CỘT CỐ ĐỊNH Ở TRÊN (Hiện ở đầu mỗi nhóm con) */}
          {isFirst && (
            <div className="hidden md:grid grid-cols-12 gap-3 pb-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-1.5 text-center mt-2 first:mt-0">
              <div className="col-span-5 text-left">Chủng loại xe</div>
              <div className="col-span-2 text-right">Sản lượng</div>
              <div className="col-span-2 text-right">Đơn giá</div>
              <div className="col-span-3 text-right">Thành tiền</div>
            </div>
          )}

          {/* MỘT DÒNG NHẬP LIỆU */}
          <div className="grid grid-cols-12 gap-3 items-center w-full py-1.5 border-b border-gray-50 last:border-0 hover:bg-slate-50/60 rounded px-1 transition-colors">
            {/* Tên loại xe */}
            <div className="col-span-12 md:col-span-5 flex items-center space-x-1">
              <span
                className="text-sm font-medium text-gray-600 dark:text-gray-200 truncate block max-w-[95%]"
                title={label}
              >
                {label}
              </span>
            </div>

            {/* Cụm tính toán */}
            <div className="col-span-12 md:col-span-7 grid grid-cols-7 gap-2 items-center">
              {/* Sản lượng */}
              <div className="col-span-3 md:col-span-2">
                <span className="block md:hidden text-[10px] text-gray-400 font-bold mb-0.5">
                  Sản lượng
                </span>
                <input
                  id={inputId}
                  ref={ref}
                  placeholder="0"
                  type="text"
                  onChange={handleInputChange}
                  {...props}
                  className={`w-full py-1 px-2 border rounded text-right text-sm font-semibold outline-none transition-all
                  ${error ? "border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-100" : "border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm"}
                  ${className}
                `}
                />
              </div>

              {/* Đơn giá */}
              <div className="col-span-2 md:col-span-2 text-center md:text-right text-xs md:text-sm text-gray-500 font-semibold">
                <span className="block md:hidden text-[10px] text-gray-400 font-bold mb-0.5">
                  Đơn giá
                </span>
                <div
                  className={`text-xs transition-colors duration-200 ${
                    isHighlightPrice
                      ? "text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                      : "text-gray-400"
                  }`}
                  title={formatMoney(price)}
                >
                  {formatMoney(price)}
                </div>
              </div>

              {/* Thành tiền */}
              <div className="col-span-2 md:col-span-3 text-right text-sm font-bold text-emerald-500">
                <span className="block md:hidden text-[10px] text-gray-400 font-bold mb-0.5">
                  Thành tiền
                </span>
                <div
                  className="pr-1 truncate"
                  title={formatMoney(String(thanhTien))}
                >
                  {formatMoney(String(thanhTien))}
                </div>
              </div>
            </div>
          </div>
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

InputSanLuong.displayName = "InputSanLuong";
export default InputSanLuong;
