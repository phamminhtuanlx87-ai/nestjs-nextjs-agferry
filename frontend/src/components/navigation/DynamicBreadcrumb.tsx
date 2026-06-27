"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// 1. Định nghĩa từ điển để dịch từ URL Key sang Tên hiển thị tiếng Việt
const breadcrumbMap:Record<string, string> = {
  "": "Trang chủ",
  "tong-quan": "Tổng Quan",
  "cong-trinh": "Công trình / Dự án",
  "ho-so": "Quản lý hồ sơ",
  "vat-tu": "Quản lý vật tư",
  "tua-chuyen": "Tua chuyến",
  "doanh-thu": "Doanh thu / Lợi nhuận",
  "nhan-vien": "Người dùng",
  "me": "Thông tin cá nhân",
  "nhap-lieu": "Nhập Sản lượng Doanh thu",
};
interface BreadcrumbProps {
  mypathname?: string;
}
const DynamicBreadcrumb = ({ mypathname }: BreadcrumbProps) => {
  const nextPathname = usePathname();
  const pathname = mypathname ?? nextPathname;

  const pathnames = pathname.split("/").filter((x) => x);
  return (
    <nav aria-label="breadcrumb" className="py-2 text-sm text-gray-500">
      <ol className="flex items-center space-x-2">
        {/* Luôn luôn có nút Trang chủ đầu tiên */}
        <li>
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Trang chủ
          </Link>
        </li>

        {pathnames.map((value, index) => {
          // Tạo đường dẫn tích lũy cho từng cấp
          // Ví dụ: cấp 1 là "/cong-trinh", cấp 2 là "/cong-trinh/ho-so"
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          // Lấy tên tiếng Việt từ map, nếu không có thì giữ nguyên chữ gốc
          const displayName =
            breadcrumbMap[value as keyof typeof breadcrumbMap] || value;

          return (
            <li key={routeTo} className="flex items-center space-x-2">
              {/* Dấu mũi tên / gạch chéo phân cách */}
              <span className="text-gray-400 mx-1">&gt;</span>

              {isLast ? (
                // Cấp cuối cùng thì hiển thị chữ đậm, không bấm được nữa
                <span className="text-gray-800 font-medium">{displayName}</span>
              ) : (
                // Cấp trung gian thì có link để bấm back lại
                <Link
                  href={routeTo}
                  className="hover:text-blue-600 transition-colors"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default DynamicBreadcrumb;
