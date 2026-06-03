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
     <div className="flex h-screen w-screen overflow-hidden bg-neutral-100">
      
      {/* 1. Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 2. Vùng nội dung bên phải */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden transition-all duration-300">
        
        {/* TRUYỀN THÊM isOpen vào Navbar để tính toán icon mũi tên */}
        <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>
    </div>
    </AuthGuard>
  );
}
