/* eslint-disable react-hooks/incompatible-library */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Guard } from "@/components/common/Guard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { getMe, MeData } from "@/services/authService";
import { UserPermission } from "@/store/useAuthStore";

// ==========================================
// CONSTANTS & UTILITIES (Đưa ra ngoài để tối ưu bộ nhớ)
// ==========================================
const DEPARTMENTS = [
  { value: "PKT", label: "Phòng Kỹ thuật - Vật tư" },
  { value: "PDT", label: "Phòng Đầu tư" },
  { value: "XNCK", label: "Xí nghiệp Cơ khí Giao thông" },
  { value: "BTGD", label: "Ban Tổng Giám đốc" },
  { value: "PTV", label: "Phòng Tài vụ" },
];

const POSITIONS = [
  { value: "CT", label: "Chủ tịch" },
  { value: "TGD", label: "Tổng Giám đốc" }, // Sửa nhãn trùng lặp nếu cần
  { value: "PTGD", label: "Phó Tổng Giám đốc" },
  { value: "TP", label: "Trưởng phòng" },
  { value: "PTP", label: "Phó Trưởng phòng" },
  { value: "GD", label: "Giám đốc" },
  { value: "PGD", label: "Phó Giám đốc" },
  { value: "NV", label: "Nhân viên" },
];
// Bản đồ cấu hình: Đơn vị nào đi kèm với danh sách mã chức vụ đó
const MAP_DEPARTMENT_POSITIONS: Record<string, string[]> = {
  PDT: ["TP", "PTP", "NV"], // Phòng Đầu tư
  PTV: ["TP", "PTP", "NV"], // Phòng Tài vụ
  PKT: ["TP", "PTP", "NV"], // Phòng Kỹ thuật - Vật tư
  XNCK: ["GD", "PGD", "NV"], // Xí nghiệp Cơ khí Giao thông
  BTGD: ["CT", "TGD", "PTGD"], // Ban Tổng Giám đốc
};
interface MeFormValues {
  fullName: string;
  userName: string;
  email: string;
  department: string;
  positions: string;
  isActive?: boolean;
}

const getInitials = (fullName: string): string => {
  if (!fullName) return "";
  const nameParts = fullName.trim().split(" ");
  return nameParts[nameParts.length - 1]?.charAt(0) || "";
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function MeForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MeFormValues>({
    defaultValues: {
      fullName: "",
      userName: "",
      email: "",
      department: "CXD",
      positions: "CXD",
    },
  });

  // State quản lý UI và Dữ liệu
  const [meData, setMeData] = useState<MeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [isPasswordModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Theo dõi giá trị thực tế trên Form
  const watchedFullName = watch("fullName") || "";
  const watchedDepartment = watch("department") || "CXD";
  const watchedPositions = watch("positions") || "CXD";
  const watchedEmail = watch("email") || "";
  // Lấy dữ liệu hồ sơ cá nhân khi Mount component
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getMe();
        if (data) {
          reset({
            fullName: data.fullName || "",
            userName: data.userName || "",
            email: data.email || "",
            department: data.department?.id || "CXD",
            positions: data.positions?.id || "CXD",
            isActive: data.isActive,
          });
          setMeData(data);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu tài khoản:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  // Quản lý đếm ngược thời gian chờ (Cooldown) khi submit lỗi
  useEffect(() => {
    if (cooldownTime <= 0) return;

    const interval = setInterval(() => {
      setCooldownTime((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownTime]);

  // Biên dịch nhanh nhãn hiển thị phòng ban/chức vụ
  const currentDeptLabel = useMemo(() => {
    return (
      DEPARTMENTS.find((d) => d.value === watchedDepartment)?.label ||
      "Chưa xác định"
    );
  }, [watchedDepartment]);

  const currentPositionLabel = useMemo(() => {
    return (
      POSITIONS.find((p) => p.value === watchedPositions)?.label ||
      "Chưa xác định"
    );
  }, [watchedPositions]);

  // Xử lý Cập nhật mật khẩu cá nhân
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không trùng khớp!");
      return;
    }
    alert("Thay đổi mật khẩu thành công!");
    setIsPasswordModalOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Xử lý gửi Form cập nhật thông tin
  const onSubmit = async (data: MeFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        fullName: data.fullName,
        email: data.email,
        department: {
          id: data.department,
          name:
            DEPARTMENTS.find((d) => d.value === data.department)?.label ||
            "Chưa xác định",
        },
        positions: {
          id: data.positions,
          name:
            POSITIONS.find((p) => p.value === data.positions)?.label ||
            "Chưa xác định",
        },
      };

      console.log("Dữ liệu cập nhật gửi đi (Payload):", payload);
      // Thực thi hàm gọi API update profile của bạn tại đây...
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu cấu hình:", error);
      setCooldownTime(300); // Kích hoạt 5 phút cooldown chống spam dữ liệu lỗi
    } finally {
      setIsSubmitting(false);
    }
  };
  const availablePositions = useMemo(() => {
    if (!watchedDepartment) return [];

    // Lấy ra danh sách các mã chức vụ được phép (ví dụ: ["TP", "PTP", "NV"])
    const allowedCodes = MAP_DEPARTMENT_POSITIONS[watchedDepartment] || [];

    // Lọc từ mảng POSITIONS gốc ra các phần tử có giá trị nằm trong danh sách được phép
    return POSITIONS.filter((pos) => allowedCodes.includes(pos.value));
  }, [watchedDepartment]);

  // 3. Hiệu ứng tự động: Nếu đổi Đơn vị mà chức vụ hiện tại không thuộc đơn vị mới, tự động reset về giá trị trống hoặc Nhân viên
  useEffect(() => {
    if (watchedDepartment) {
      const allowedCodes = MAP_DEPARTMENT_POSITIONS[watchedDepartment] || [];
      const currentPosition = watch("positions");

      // Nếu chức vụ hiện tại không nằm trong danh sách được cho phép của phòng ban mới
      if (currentPosition && !allowedCodes.includes(currentPosition)) {
        // Tự gán mặc định về chức vụ đầu tiên khả dụng hoặc chuỗi trống để bắt người dùng chọn lại
        setValue("positions", allowedCodes[allowedCodes.length - 1] || "");
      }
    }
  }, [watchedDepartment, setValue, watch]);
  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 font-sans space-y-6">
      {/* TIÊU ĐỀ TRANG */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Cài đặt tài khoản
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin hồ sơ và cấu hình bảo mật cá nhân.
          </p>
        </div>
        <button
          onClick={() => setIsPasswordModalOpen(true)}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center gap-2"
        >
          🔒 Đổi mật khẩu
        </button>
      </div>

      {/* KHỐI LAYOUT CHÍNH */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* PHẦN TRÁI: BANNER & AVATAR ĐỊNH DANH (Rộng 4 cột) */}
        <div className="md:col-span-4 bg-slate-50/80 p-6 md:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200/60">
          {/* AVATAR KHỐI TRÒN */}
          <div className="md:col-span-4 bg-slate-50/80 p-6 md:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200/60 min-w-0 w-full overflow-hidden">
            {/* AVATAR KHỐI TRÒN */}
            <div className="relative mb-5 shrink-0">
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md ring-4 ring-white select-none">
                {isLoading ? (
                  <span className="text-sm animate-pulse">...</span>
                ) : (
                  getInitials(watchedFullName)
                )}
              </div>
            </div>

            {/* THÔNG TIN HỒ SƠ CHÍNH - FIX TRÀN CHỮ BẰNG BREAK-WORDS */}
            <div className="space-y-2 w-full max-w-full px-2 min-w-0">
              {/* Tên quá dài sẽ tự động xuống hàng gọn gàng, không bị chọc thủng khung */}
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight wrap-break-word whitespace-pre-wrap block w-full">
                {isLoading ? "---" : watchedFullName}
              </h2>
              <p
                className="text-sm font-bold text-indigo-600 tracking-wide truncate w-full"
                title={currentDeptLabel}
              >
                {isLoading ? "Đang tải đơn vị..." : currentDeptLabel}
              </p>
              <p
                className="text-xs font-semibold text-slate-600 truncate w-full"
                title={currentPositionLabel}
              >
                {isLoading ? "Đang tải chức vụ..." : currentPositionLabel}
              </p>
            </div>

            {/* ĐƯỜNG PHÂN CÁCH */}
            <div className="w-full border-t border-slate-200/80 my-5 shrink-0"></div>

            {/* CHI TIẾT ĐỊNH DANH - FIX TRÀN EMAIL VÀ USERNAME */}
            <div className="w-full space-y-4 text-left px-2 min-w-0 max-w-full">
              <div className="min-w-0 w-full">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  Tên đăng nhập
                </span>
                <span
                  className="text-sm font-mono font-bold text-blue-600 bg-blue-50/50 px-2 py-1 rounded border border-blue-100/50 inline-block max-w-full truncate"
                  title={meData?.userName}
                >
                  {isLoading ? "@..." : `@${meData?.userName}`}
                </span>
              </div>

              <div className="min-w-0 w-full">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">
                  Email liên hệ
                </span>
                {/* Email siêu dài không có khoảng trắng sẽ bị bẻ gãy ký tự để xuống hàng (break-all) */}
                <span className="text-xs font-mono font-medium text-blue-600 block mt-0.5 break-all max-w-full bg-slate-100/60 p-2 rounded border border-slate-200/40">
                  {isLoading ? "..." : watchedEmail}
                </span>
              </div>

              <div className="pt-1 shrink-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1.5">
                  Trạng thái hệ thống
                </span>
                {!isLoading && meData?.isActive !== undefined ? (
                  meData.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Đang hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                      Chưa kích hoạt
                    </span>
                  )
                ) : (
                  <span className="text-xs text-slate-400 font-medium animate-pulse">
                    Đang kiểm tra...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM CHỈNH SỬA CHÍNH */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:col-span-8 p-6 md:p-8 space-y-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Thông tin nhân sự cố định
          </h3>

          <Input
            label="Tên tài khoản (Không thể sửa)"
            type="text"
            disabled
            className="bg-slate-100 cursor-not-allowed"
            {...register("userName")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Họ và tên"
              type="text"
              {...register("fullName", {
                required: "Vui lòng nhập Họ và tên",
                maxLength: {
                  value: 50,
                  message: "Họ và tên không được vượt quá 50 ký tự",
                },
              })}
              error={errors?.fullName?.message}
            />

            <Input
              label="Email"
              type="text"
              placeholder="abc@gmail.com"
              {...register("email", {
                required: "Vui lòng nhập Email",
                maxLength: {
                  value: 100,
                  message: "Email không được vượt quá 100 ký tự",
                },
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email không đúng định dạng",
                },
              })}
              error={errors?.email?.message}
            />

            <SelectField
              label="Đơn vị"
              options={DEPARTMENTS}
              {...register("department", { required: "Vui lòng chọn đơn vị" })}
              error={errors.department?.message}
            />

            <SelectField
              label="Chức vụ"
              options={availablePositions}
              disabled={availablePositions.length === 0}
              {...register("positions", { required: "Vui lòng chọn chức vụ" })}
              error={errors.positions?.message}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Guard
              requiredPermission={
                UserPermission.USER_UPDATE || UserPermission.USER_CREATE
              }
            >
              <Button
                variant="primary"
                className="px-8 shadow-lg shadow-indigo-200 min-w-30"
                type="submit"
                disabled={isLoading || isSubmitting || cooldownTime > 0}
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : cooldownTime > 0
                    ? `Đợi (${cooldownTime}s)`
                    : "Lưu thay đổi"}
              </Button>
            </Guard>
          </div>
        </form>
      </div>

      {/* KHỐI HIỂN THỊ DỰ ÁN THEO DÕI */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 space-y-2">
        <h3 className="text-sm font-bold text-slate-800">Công trình / Dự án</h3>
        <p className="text-xs text-slate-400">
          Các công trình/dự án đang phụ trách hoặc theo dõi.
        </p>
      </div>

      {/* MODAL ĐỔI MẬT KHẨU */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden mx-4">
            <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cập nhật bảo mật
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-5 space-y-4">
              {["currentPassword", "newPassword", "confirmPassword"].map(
                (field) => (
                  <div key={field} className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">
                      {field === "currentPassword"
                        ? "Mật khẩu hiện tại"
                        : field === "newPassword"
                          ? "Mật khẩu mới"
                          : "Nhập lại mật khẩu mới"}
                    </label>
                    <input
                      type="password"
                      placeholder={
                        field === "newPassword"
                          ? "Tối thiểu 6 ký tự"
                          : "••••••••"
                      }
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs focus:outline-none focus:border-indigo-600"
                      required
                    />
                  </div>
                ),
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-md hover:bg-slate-50 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-bold transition-all"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
