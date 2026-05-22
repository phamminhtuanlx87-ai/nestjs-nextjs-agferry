"use client";
import React from "react";
import NavbarLink from "./NavbarLink";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

function Navbar() {
  const { user } = useAuthStore();
  const fullName = user ? `${user.fullName}` : "";

  // Logic lấy chữ cái đầu
  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    const displayLetter = nameParts[nameParts.length - 1].charAt(0);
    return displayLetter;
  };
  return (
    <div>
      <nav className="flex items-center justify-between bg-neutral-bg-header p-4">
        <div className="flex gap-4">
          <NavbarLink href="/tong-quan">Trang chủ</NavbarLink>
          <NavbarLink href="/pha">Phương tiện</NavbarLink>
          <NavbarLink href="/tien-luong">Tiền lương</NavbarLink>
        </div>
        <nav className="hidden md:flex gap-3 text justify-start items-center">
          <div className="relative w-10 h-10">
            <div className="w-full h-full rounded-full bg-indigo-200 flex items-center justify-center text-4xl font-bold text-indigo-700">
              {getInitials(fullName)}
            </div>

            {/* Status */}
            <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex gap-1">
            <Link
              href="profile"
              className="hover:text-accent text-white transition"
            >
              {fullName}
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-5 text-white hover:text-accent cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </nav>
      </nav>
    </div>
  );
}

export default Navbar;
