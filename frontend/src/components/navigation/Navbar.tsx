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
            className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center justify-center"
          >
            <div className="lg:hidden">
              <RiMenuLine size={24} />
            </div>
            <div className="hidden lg:block">
              {isSidebarOpen ? (
                <RiMenuFoldLine size={24} />
              ) : (
                <RiMenuUnfoldLine size={24} />
              )}
            </div>
          </button>

          <div className="flex items-center gap-4">
            <NavbarLink href="/tong-quan">Trang chủ</NavbarLink>
            <NavbarLink href="/pha">Phương tiện</NavbarLink>
            <NavbarLink href="/tien-luong">Tiền lương</NavbarLink>
          </div>
        </div>
        <nav className="hidden md:flex gap-3 text justify-start items-center">
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
