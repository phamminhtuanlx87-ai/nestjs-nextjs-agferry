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
    const cleanQuantity = String(quantity || "0").replace(/\./g, "");
    const cleanPrice = String(price || "0").replace(/\./g, "");

    const thanhTien =
      Math.round(Number(cleanQuantity) * Number(cleanPrice)) || 0;

    const inputId = props.name || props.id;
 
   
    // Xử lý sự kiện khi người dùng gõ số
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // 1. Loại bỏ toàn bộ ký tự không phải là số (Giữ lại chuỗi thuần số: "10000")
      const rawValue = e.target.value.replace(/\D/g, "");

      if (onChange) {
        // 2. Gán giá trị sạch không dấu chấm vào event target
        e.target.value = rawValue;

        // 3. Cập nhật trực tiếp vào State của React Hook Form
        onChange(e);
      }
    };

    // 🌟 MẤU CHỐT: Khi hiển thị ra thẻ <input>, ta dùng giá trị đã được định dạng dấu chấm.
    // Nhưng khi truyền dữ liệu ngầm, Form vẫn hiểu là số thuần túy.
    const hienThiGiaTri = formatCurrency(cleanQuantity);
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
                  value={hienThiGiaTri === "0" ? "" : hienThiGiaTri}
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
