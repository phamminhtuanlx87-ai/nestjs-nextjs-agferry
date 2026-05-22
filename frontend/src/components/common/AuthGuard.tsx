"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";


export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, token, refreshToken } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Chỉ chạy một lần duy nhất khi component được gắn vào trình duyệt
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      // 1. CHỈ kiểm tra xem đã login chưa (có user và token không)
      if (!user || !token || !refreshToken) {
        if (window.location.pathname !== "/login") {
          router.push("/login");
        }
        return;
      }

      // Hãy để Interceptor tự xử lý khi gọi API bị 401.
    }
  }, [isMounted, user, token, router, refreshToken]);

  // Trong khi chờ đợi hoặc chưa login thì không cho xem nội dung
  if (!isMounted || !user || !token || !refreshToken) {
    return null;
  }
  if (!isMounted || !user || !token || !refreshToken) {
    // Thêm dòng này để nếu đang ở trang login thì không trả về null (tránh trang trắng)
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/login"
    ) {
      return <>{children}</>;
    }
    return null;
  }
  return <>{children}</>;
};
