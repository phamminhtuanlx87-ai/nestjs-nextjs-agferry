"use client";

import { useEffect, useState } from "react";

interface PingData {
  status: "online" | "offline" | "error";
  latency: string;
}

export default function PingStatus() {
  const [pingData, setPingData] = useState<PingData>({
    status: "online",
    latency: "0ms",
  });

  useEffect(() => {
    // Chạy kiểm tra ngay khi nạp trang
    const checkServer = async () => {
      const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const startTime = Date.now();

      try {
        const res = await fetch(BACKEND_URL, {
          method: "HEAD", // Chỉ lấy Header, siêu nhẹ
          mode: "cors", // Bắt buộc phải cấu hình CORS ở Backend cho phép Domain Web truy cập
          cache: "no-store",
        });

        const responseTime = Date.now() - startTime;
        setPingData({ status: "online", latency: `${responseTime}ms` });
      } catch {
        setPingData({ status: "offline", latency: "--" });
      }
    };

    // Thiết lập chu kỳ tự động ping lại mỗi 30 giây
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-mono">
      {/* Đèn báo trạng thái màu sắc động */}
      <span
        className={`h-2.5 w-2.5 rounded-full animate-pulse ${
          pingData.status === "online" ? "bg-green-500" : "bg-red-500"
        }`}
      />

      <span className="text-gray-200 capitalize">{pingData.status}</span>
      <span className="text-gray-400">({pingData.latency})</span>
    </div>
  );
}
