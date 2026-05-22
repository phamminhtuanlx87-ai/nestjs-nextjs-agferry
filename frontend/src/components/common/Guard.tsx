"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface GuardProps {
  requiredPermission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Guard: React.FC<GuardProps> = ({ requiredPermission, children, fallback = null }) => {
  const user = useAuthStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);

  // Kích hoạt ngay khi Client đã nạp xong localStorage vào Store
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Ghi nhớ quyền để tránh re-render liên tục gây lag
  const hasPermission = useMemo(() => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(requiredPermission);
  }, [user, requiredPermission]);

  // CHỐT CHẶN: Trong lúc Server đang render hoặc Client đang load dữ liệu từ localStorage
  // Thay vì trả về null (gây sập/giật layout), hãy trả về một giao diện Loading tĩnh
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] w-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <p className="ml-2 text-slate-500 text-sm">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  // Nếu đã load xong mà không có quyền
  if (!hasPermission) {
    return <>{fallback}</>;
  }

  // Đủ quyền hiển thị nội dung mượt mà
  return <>{children}</>;
};