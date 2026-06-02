"use client";
import React from "react";

interface HeaderConfig {
  label: string;
  key: string;
  className?: string; // Để tùy chỉnh ẩn hiện hoặc độ rộng
  align?: "left" | "center" | "right";
}

interface TableProps {
  headers: HeaderConfig[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
      {/* 🌟 THAY ĐỔI: Thêm class "table-fixed" vào đây để ép trình duyệt tuân thủ max-w/width của cột */}
      <table className="w-full text-sm text-left table-fixed min-w-250">
        <thead className="bg-gray-100 text-gray-500 uppercase tracking-wider text-xs font-semibold">
          <tr>
            {headers.map((header, index) => (
              <th
                key={header.key || index}
                className={`px-4 py-3 font-semibold ${header.className || ""} ${
                  header.align === "right"
                    ? "text-right"
                    : header.align === "center"
                      ? "text-center"
                      : "text-left"
                }`}
                // Định dạng căn lề theo config
                style={{ textAlign: header.align || "left" }}
              >
                <span className="block whitespace-pre-line leading-snug wrap-break-word">
                  {header.label}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {children}
        </tbody>
      </table>
    </div>
  );
}