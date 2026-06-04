"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import banner_left from "@/assets/images/banner_left.png";
import Image from "next/image";
import Button from "../ui/Button";
import { useAuthStore } from "@/store/useAuthStore";

const menuItems = [
  { name: "Tổng quan", href: "/tong-quan", icon: "📊" },
  { name: "Công trình / Dự án", href: "/cong-trinh", icon: "🛠️" },
  { name: "Hồ sơ / Văn bản", href: "/ho-so", icon: "📄" },
  { name: "Quản lý vật tư", href: "/vat-tu", icon: "📦" },
  { name: "Tua chuyến", href: "/tua-chuyen", icon: "⛴️" },
  { name: "Doanh thu / Lợi nhuận", href: "/doanh-thu", icon: "💰" },
  { name: "Người dùng", href: "/nhan-vien", icon: "👥", requiredRole: "ADMIN" },
  // { name: "Báo cáo", href: "/bao-cao", icon: "📊" },
  // { name: "Cài đặt", href: "/cai-dat", icon: "⚙️" },
];
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const onClickHandler = () => {
    logout();
  };
  const router = useRouter();
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden transition-opacity duration-300"
          onClick={onClose} // Click ra ngoài tự động đóng sidebar
        />
      )}
      {/* <aside
      className="w-64 h-screen bg-primary text-white flex flex-col transition-transform duration-300 shrink-0
             fixed top-0 left-0 z-50 -translate-x-full 
             md:static md:translate-x-0"
    > */}
      <aside
        className={`w-64 h-screen bg-primary text-white flex flex-col transition-transform duration-300 shrink-0 z-50
          fixed top-0 left-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
         lg:static lg:translate-x-0`} // Trên máy tính luôn cố định, trên mobile phụ thuộc vào isOpen
      >
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-white  p-4 border-b border-white/20">
          <div
            className="bg-neutral-bg rounded-full hover:text-accent transition cursor-pointer"
            onClick={() => router.push("/tong-quan")}
          >
            <Image
              src={banner_left}
              alt="Cty Cổ phần Phà An Giang"
              className="object-cover w-10 h-10"
              loading="eager"
            />
          </div>
          <span
            className="text-sm lg:text-lg hover:text-accent transition cursor-pointer min-w-100"
            onClick={() => router.push("/tong-quan")}
          >
            An Giang Ferry JSC
          </span>
          {/* <h2 className="h-14 flex items-center justify-between px-4 border-b border-white/20 text-lg font-semibold cursor-pointer hover:text-accent transition">
          Bảng điều khiển
        </h2> */}
          <div
            className={`p-4 font-bold border-b border-white/10 flex justify-between items-center ${isOpen ? "block" : "hidden"} md:block`}
          >
            <button onClick={onClose} className="md:hidden text-white text-xl hover:text-accent transition hover:bg-white/20 rounded-lg p-1">
              ✕
            </button>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-2">
          {menuItems
            .filter((item) => {
              // Nếu mục menu yêu cầu quyền ADMIN, kiểm tra xem user.role có phải ADMIN không
              if (item.requiredRole === "ADMIN") {
                return user?.role === "ADMIN";
              }
              // Các mục khác không yêu cầu quyền thì luôn hiển thị
              return true;
            })
            .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                flex items-center space-x-3 p-3 rounded-lg transition-all
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-accent dark:text-orange-500 font-semibold"
                    : " text-white dark:text-gray-400 hover:bg-accent dark:hover:bg-gray-800"
                }
              `}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          <hr className="border-0 h-px bg-gray-300 opacity-30 shadow-md my-6" />
          <Link
            className="px-3 py-2 rounded hover:bg-accent flex gap-2 items-center justify-start cursor-pointer"
            href="/me"
          >
            <span>👤</span>
            <span>Thông tin cá nhân</span>
          </Link>
          <hr className="border-0 h-px bg-gray-300 opacity-30 shadow-md my-6" />
          <Button
            className="px-3 py-2 rounded hover:bg-accent flex gap-2 items-center justify-start cursor-pointer w-full"
            onClick={onClickHandler}
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </Button>
        </nav>

        <div className="p-4 border-t border-[(--border)] text-xs text-gray-400 text-center">
          © 2026 Phà An Giang
        </div>
      </aside>
    </>
  );
}
