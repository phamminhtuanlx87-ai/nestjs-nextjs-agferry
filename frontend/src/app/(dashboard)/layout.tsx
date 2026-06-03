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
      {/* Thẻ cha ngoài cùng chia layout thành 2 phần: Trái (Sidebar) và Phải (Nội dung) */}
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-100">
      
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Vùng nội dung bên phải: Phải có min-w-0 để các phần tử grid/table bên trong không bị phình to vỡ khung */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        
        {/* Thanh điều hướng Navbar nằm trên cùng */}
        <Navbar />

        {/* Nội dung trang quản lý chạy scroll độc lập ở đây */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

      </div>

    </div>
    </AuthGuard>
  );
}
