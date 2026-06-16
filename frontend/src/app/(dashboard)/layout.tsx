"use client";
import React from "react";
import Sidebar from "@/components/navigation/Sidebar";
import Navbar from "@/components/navigation/Navbar";
import { AuthGuard } from "@/components/common/AuthGuard";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-neutral-100">
        {/* 1. Đảm bảo truyền đúng state đóng mở xuống cho Sidebar */}
        <div className="overflow-y-auto no-scrollbar">
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </div>
        <div className="flex flex-col flex-1 h-screen min-w-0">
          {/* 2. Đảm bảo truyền hàm ĐẢO TRẠNG THÁI xuống cho Navbar */}
          <Navbar
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
