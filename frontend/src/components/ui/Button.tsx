"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}: ButtonProps) {
  // Định nghĩa màu sắc cho từng loại nút
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "btn-danger",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors cursor-pointer ${className} 
      ${disabled ? "bg-gray-300 opacity-50 cursor-not-allowed" : variants[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
