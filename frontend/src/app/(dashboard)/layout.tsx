import Sidebar from "@/components/navigation/Sidebar";
import Navbar from "@/components/navigation/Navbar";
import { AuthGuard } from "@/components/common/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden">
        {/* 1. Sidebar cố định bên trái */}
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* 2. Navbar nằm trên cùng của nội dung chính */}
          <Navbar />

          {/* 3. Nội dung trang Quản lý phà */}
          <main className="p-6 bg-neutral-bg min-h-full">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
