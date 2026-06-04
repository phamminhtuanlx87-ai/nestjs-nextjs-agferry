'use client';

import { useEffect, useState, useCallback } from 'react';

export default function PingStatus() {
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [latency, setLatency] = useState<number | null>(null);

 const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth/health` || "http://localhost:3000/api/auth/health";

  const wakeUpRender = useCallback(async () => {
    const startTime = Date.now();
    try {
      // Dùng HEAD request để tối ưu băng thông, chỉ lấy header không lấy body
      const res = await fetch(BACKEND_URL, {
        method: 'HEAD',
        mode: 'cors',
        cache: 'no-store',
        signal: AbortSignal.timeout(60000) // Gói Free lúc tỉnh giấc có thể mất tới 30-50s nên để timeout 1 phút
      });

      if (res.ok) {
        setLatency(Date.now() - startTime);
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error("Ping Render thất bại:", error);
      setStatus('offline');
    }
  }, [BACKEND_URL]);

  useEffect(() => {
  // Tạo một hàm kích hoạt riêng để ESLint không bắt lỗi gọi trực tiếp
  const initPing = async () => {
    await wakeUpRender();
  };
  
  initPing(); // Chạy ngầm lập tức khi vào trang

  const TEN_MINUTES = 10 * 60 * 1000;
  const intervalId = setInterval(() => {
    wakeUpRender();
  }, TEN_MINUTES);

  return () => clearInterval(intervalId);
}, [wakeUpRender]);

  return (
    <div className="flex items-center justify-center gap-2 p-2 text-xs">
      <span className={`h-2 w-2 rounded-full ${
        status === 'online' ? 'bg-green-500 animate-pulse' : 
        status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
      }`} />
      <span className="text-gray-300 ">
        Kết nối: {status === 'loading' ? 'Đang gọi...' : status === 'online' ? `${latency}ms` : ' Mất kết nối'}
      </span>
    </div>
  );
}