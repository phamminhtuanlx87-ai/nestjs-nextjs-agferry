"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import banner_left from "@/assets/images/banner_left.png";
import Image from "next/image";
import Button from "../ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import PingStatus from "../modules/ping/PingStatus";

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
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
          className="fixed inset-0 bg-black/40 z-51 xl:hidden transition-opacity duration-300"
          onClick={onClose} // Click ra ngoài tự động đóng sidebar
        />
      )}
      {/* <aside
        className={`w-64 h-screen bg-primary text-white flex flex-col transition-transform duration-300 shrink-0 z-50
          fixed top-0 left-0 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
         xl:static xl:translate-x-0`} // Trên máy tính luôn cố định, trên mobile phụ thuộc vào isOpen
      > */}
      <aside
        className={`h-screen bg-primary text-white flex flex-col transition-all duration-300 shrink-0 z-52
    fixed top-0 left-0 
    xl:static xl:translate-x-0
    ${
      isOpen
        ? "w-64 translate-x-0 2xl:w-64"
        : "-translate-x-full xl:w-20 2xl:w-64"
    }`}
      >
        {/* Logo */}
        <div
          onClick={() => router.push("/tong-quan")}
          className={`border-b border-white/10 flex items-center transition-all duration-300 cursor-pointer w-full h-20 
    ${
      isOpen
        ? "flex-row justify-start gap-3 p-4" // Khi isOpen = true: Luôn ở dạng hàng ngang đầy đủ
        : "flex-col justify-center items-center p-0 pt-8 xl:flex-col xl:justify-center xl:items-center xl:p-0 xl:pt-8 2xl:flex-row 2xl:justify-start 2xl:gap-3 2xl:p-4"
      // Khi isOpen = false:
      // - Dưới xl & tại xl: Chuyển thành trục dọc, căn giữa để hiện mỗi logo
      // - Tại 2xl trở lên: Ghi đè lại thành hàng ngang, căn trái, p-4 đầy đủ
    }`}
        >
          {/* KHỐI TRÒN CHỨA LOGO (Không lo méo, không lo dính lề) */}
          <div className="bg-neutral-bg rounded-full shrink-0 overflow-hidden shadow-sm w-10 h-10 flex items-center justify-center">
            <Image
              src={banner_left}
              alt="Cty Cổ phần Phà An Giang"
              className="object-cover w-full h-full"
              loading="eager"
            />
          </div>
          {/* 2. KHỐI TEXT TÊN CÔNG TY (Chỉ hiển thị khi Sidebar đang mở rộng) */}
          <span
            className={`text-sm font-bold hover:text-accent transition-all duration-200 whitespace-nowrap
      ${
        isOpen
          ? "block opacity-100"
          : "hidden xl:hidden 2xl:block 2xl:opacity-100"
      }`}
          >
            An Giang Ferry JSC
          </span>
          <div
            className={`p-4 font-bold border-white/10 flex justify-between items-center ${isOpen ? "block" : "hidden"} xl:block`}
          >
            <button
              onClick={onClose}
              className="xl:hidden text-white text-xl hover:text-accent transition hover:bg-white"
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-2 overflow-y-auto">
          <div className="flex flex-col h-full overflow-x-hidden">
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
               ${
                 isOpen
                   ? "flex-row justify-start gap-3 px-4" // Khi mở: Hàng ngang, căn trái, có khoảng cách
                   : "flex-col justify-center items-center p-3 xl:flex-col xl:justify-center xl:items-center xl:px-0 2xl:flex-row 2xl:justify-start 2xl:gap-3 2xl:px-4"
                 // Khi đóng:
                 // - Dưới xl & tại xl: Chuyển trục dọc, căn giữa để icon nằm chính giữa thanh w-20
                 // - Tại 2xl trở lên: Ghi đè lại thành hàng ngang, căn trái đầy đủ
               }
              `}
                    title={
                      !isOpen &&
                      !window.matchMedia("(min-width: 1536px)").matches
                        ? item.name
                        : ""
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span
                      className={`text-sm transition-all duration-200 whitespace-nowrap
                         ${
                           isOpen
                             ? "block opacity-100" // Khi isOpen = true: Luôn hiện chữ
                             : "hidden xl:hidden 2xl:block 2xl:opacity-100" // Khi isOpen = false: Ẩn ở mobile và xl, tự động hiện lại ở mốc 2xl
                         }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            <hr className="border-0 h-px bg-gray-300 opacity-30 shadow-md my-6" />
            <Link
              className="px-3 py-2 rounded hover:bg-accent flex gap-2 items-center justify-start cursor-pointer"
              href="/me"
            >
              <span>👤</span>
              <span
                className={`text-sm transition-all duration-200 whitespace-nowrap
                ${
                  isOpen
                    ? "block opacity-100" // Khi isOpen = true: Luôn hiện chữ
                    : "hidden xl:hidden 2xl:block 2xl:opacity-100" // Khi isOpen = false: Ẩn ở mobile và xl, tự động hiện lại ở mốc 2xl
                }`}
              >
                Thông tin cá nhân
              </span>
            </Link>
            <hr className="border-0 h-px bg-gray-300 opacity-30 shadow-md my-6" />
            <Button
              className="px-3 py-2 rounded hover:bg-accent flex gap-2 items-center justify-start cursor-pointer w-full"
              onClick={onClickHandler}
            >
              <span>🚪</span>
              <span
                className={`text-sm transition-all duration-200 whitespace-nowrap
                ${
                  isOpen
                    ? "block opacity-100" // Khi isOpen = true: Luôn hiện chữ
                    : "hidden xl:hidden 2xl:block 2xl:opacity-100" // Khi isOpen = false: Ẩn ở mobile và xl, tự động hiện lại ở mốc 2xl
                }`}
              >
                Đăng xuất
              </span>
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-[(--border)] text-xs text-gray-400 text-center">
          © 2026 Phà An Giang
          <span
            className={`text-sm transition-all duration-200 whitespace-nowrap
            ${
              isOpen
                ? "block opacity-100" // Khi isOpen = true: Luôn hiện chữ
                : "hidden xl:hidden 2xl:block 2xl:opacity-100" // Khi isOpen = false: Ẩn ở mobile và xl, tự động hiện lại ở mốc 2xl
            }`}
          >
            <PingStatus />
          </span>
        </div>
      </aside>
    </>
  );
}
