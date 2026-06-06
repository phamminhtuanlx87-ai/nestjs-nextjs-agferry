"use client";
import React from "react";
import NavbarLink from "./NavbarLink";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { RiMenuFoldLine, RiMenuLine, RiMenuUnfoldLine } from "@remixicon/react";

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}
function Navbar({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const { user } = useAuthStore();
  const fullName = user ? `${user.fullName}` : "";

  // Logic lấy chữ cái đầu
  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    const displayLetter = nameParts[nameParts.length - 1].charAt(0);
    return displayLetter;
  };
  const router = useRouter();
  return (
    <div>
      <nav className="flex items-center justify-between bg-neutral-bg-header p-4">
        <div className="flex items-center gap-6">
          {/* NÚT BẤM MENU: Bây giờ LUÔN HIỆN ở mọi màn hình để bấm ẩn/hiện Sidebar */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center 2xl:hidden"
            /* 2xl:hidden đảm bảo lên màn hình lớn 1536px nút này biến mất hoàn toàn */
          >
            {/* 1. Dưới mốc 1280px (Mobile/Tablet): Hiện nút 3 gạch */}
            <div className="xl:hidden">
              <RiMenuLine size={24} />
            </div>

            {/* 2. Tại mốc 1280px (xl): Hiện icon mũi tên đóng/mở động */}
            <div className="hidden xl:block">
              {isSidebarOpen ? (
                <RiMenuFoldLine size={24} /> // Trạng thái mở rộng (w-64): Hiện mũi tên thu gọn (<)
              ) : (
                <RiMenuUnfoldLine size={24} /> // Trạng thái đang thu hẹp (w-20): Hiện mũi tên mở rộng (>)
              )}
            </div>
          </button>

          <div className="hidden md:flex items-center gap-4">
            <NavbarLink href="/tong-quan">Trang chủ</NavbarLink>
            <NavbarLink href="/pha">Phương tiện</NavbarLink>
            <NavbarLink href="/tien-luong">Tiền lương</NavbarLink>
          </div>
        </div>
        <nav className="flex gap-3 text justify-start items-center ">
          <div
            className="relative w-10 h-10 cursor-pointer hover:scale-110 transition-all duration-300"
            onClick={() => router.push("/me")}
          >
            <div className="w-full h-full rounded-full bg-indigo-200 flex items-center justify-center text-4xl font-bold text-indigo-700">
              {getInitials(fullName)}
            </div>

            {/* Status */}
            <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex gap-1">
            <Link
              href="/me"
              className="hover:text-accent text-white transition-all duration-300"
            >
              {fullName}
            </Link>
          </div>
        </nav>
      </nav>
    </div>
  );
}

export default Navbar;
