'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Chỉ chạy một lần duy nhất khi component được gắn vào trình duyệt
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Chỉ thực hiện kiểm tra khi đã Mounted (đã có thể truy cập localStorage)
    if (isMounted && !user) {
      router.push("/login");
    }
  }, [isMounted, user, router]);

  // Trong lúc đợi nạp dữ liệu hoặc không có user, trả về null để tránh nháy giao diện
  if (!isMounted || !user) {
    return null; 
  }

  return <>{children}</>;
};