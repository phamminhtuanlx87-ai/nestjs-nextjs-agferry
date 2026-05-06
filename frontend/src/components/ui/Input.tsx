import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Dùng forwardRef để React Hook Form có thể truy cập vào thẻ input thật
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const inputId = props.name || props.id;
    return (
      <div className="flex flex-col gap-3 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-shadow-sm text-gray-500  font-semibold dark:text-gray-200"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref} // Gán ref cực kỳ quan trọng ở đây
          className={`input-primary h-11 border
           ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
          {...props} // Nhận tất cả thuộc tính từ register như name, onBlur, onChange
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
