"use client";

import { Guard } from "@/components/common/Guard";
import UserTable, { IUser } from "@/components/modules/nhan-vien/UserTable";
import DynamicBreadcrumb from "@/components/navigation/DynamicBreadcrumb";
import Button from "@/components/ui/Button";
import DropDown from "@/components/ui/DropDown";
import Input from "@/components/ui/Input";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Modal from "@/components/ui/Modal";
import { SelectField } from "@/components/ui/SelectField";
import {
  AdminCreateFormValues,
  AdminCreateRequest,
  adminCreateUser,
  getAllUsers,
} from "@/services/authService";
import { UserPermission } from "@/store/useAuthStore";
import { alertService } from "@/utils/swal";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { BiFilter } from "react-icons/bi";
import { toast } from "sonner";


type FilterMode = "all" | "active" | "inactive";

export default function NhanVienPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [viewMode, setViewMode] = useState<FilterMode>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [dsTaiKhoan, setDsTaiKhoan] = useState<AdminCreateRequest[]>([]);
  const router = useRouter();

  // Khai báo hook form
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AdminCreateFormValues>({
    defaultValues: {
      fullName: "",
      department: "CXD",
      userName: "",
      password: "",
      email: "",
      role: "GUEST",
      positions: "CXD",
    },
  });

  const selectItems = [
    { value: "all", label: "Tất cả" },
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Chưa kích hoạt" },
  ];
  const OPTIONS_ROLE = [
    { value: "MANAGER", label: "Quản lý" },
    { value: "USER", label: "Nhân Viên" },
    { value: "GUEST", label: "Khách" },
  ];
  const OPTIONS_DEPARTMENT = [
    { value: "PKT", label: "Phòng Kỹ thuật - Vật tư" },
    { value: "PDT", label: "Phòng Đầu tư" },
    { value: "XNCK", label: "Xí nghiệp Cơ khí Giao thông" },
    { value: "BTGD", label: "Ban Tổng Giám đốc" },
    { value: "PTV", label: "Phòng Tài vụ" },
    { value: "PVT", label: "Phòng Vận tải" },
    { value: "CXD", label: "Chưa xác định" },
  ];

  const OPTIONS_POSITIONS = [
    { value: "CT", label: "Chủ tịch" },
    { value: "TGD", label: "Tổng Giám đốc" },
    { value: "PTGD", label: "Phó Tổng Giám đốc" },
    { value: "TP", label: "Trưởng phòng" },
    { value: "PTP", label: "Phó Trưởng phòng" },
    { value: "GD", label: "Giám đốc" },
    { value: "PGD", label: "Phó Giám đốc" },
    { value: "NV", label: "Nhân viên" },
    { value: "CXD", label: "Chưa xác định" },
  ];
  // Lắng nghe sự thay đổi của Họ Tên và Phòng Ban khi user đang gõ
  const watchFullName = useWatch({ control, name: "fullName" });
  const watchDepartment = useWatch({ control, name: "department" });
  useEffect(() => {
    const loadDataInside = async () => {
      try {
        if (refreshKey === 0) setIsLoading(true);
        const res = await getAllUsers(viewMode);
        setUsers(res || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDataInside();
  }, [viewMode, refreshKey]);

  // Hàm xóa dấu tiếng Việt chuẩn
  const removeVietnameseTones = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .trim();
  };

  // Hàm lấy mã phòng ban viết tắt (Ví dụ: "Phòng Đầu tư" -> "pdt")
  const getDepartmentCode = (deptLabel: string) => {
    if (!deptLabel) return "nv";
    const hasPhong = deptLabel.trim().toLowerCase().startsWith("phòng");
    const cleanDept = removeVietnameseTones(deptLabel).toLowerCase();
    const cleanNameWithoutPhong = cleanDept.replace(/^phong\s+/, "");
    const words = cleanNameWithoutPhong.split(/[\s-]+/).filter(Boolean);
    const initials = words.map((w) => w[0]).join("");
    return hasPhong ? `p${initials}` : initials;
  };

  // Hàm tạo ngẫu nhiên mật khẩu khởi tạo ngẫu nhiên dài 8 ký tự
  const generateRandomPassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
    return Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  };
  useEffect(() => {
    if (watchFullName) {
      // 1. Xử lý tên chính và ký tự đầu của họ đệm
      const cleanName = removeVietnameseTones(watchFullName)
        .toLowerCase()
        .replace(/\s+/g, " ");
      const nameParts = cleanName.split(" ");
      const firstName = nameParts.pop() || "";
      const initials = nameParts.map((part) => part[0]).join("");

      // 3. Tạo username gốc
      const baseUsername = `${initials}${firstName}`;

      // 4. Vòng lặp check trùng, nếu trùng thì tự động tăng số (Ví dụ: pmtuan_pdt1)
      let finalUsername = baseUsername;
      let counter = 1;
      // 2. Lấy mã phòng ban dựa trên value/label được chọn
      // Tìm text hiển thị của option tương ứng trong OPTIONS_DEPARTMENT
      const selectedDept =
        OPTIONS_DEPARTMENT.find((opt) => opt.value === watchDepartment)
          ?.label || "";
      const deptCode = getDepartmentCode(selectedDept);
      if (users.some((user) => user.userName === finalUsername)) {
        finalUsername = `${baseUsername}_${deptCode}`;
      }

      while (users.some((user) => user.userName === finalUsername)) {
        finalUsername = `${baseUsername}_${deptCode}${counter}`;
        counter++;
      }

      // 5. Đẩy dữ liệu vào form một cách tự động
      setValue("userName", finalUsername);

      // Nếu chưa có mật khẩu thì sinh ngẫu nhiên luôn
      setValue("password", generateRandomPassword());
    } else {
      setValue("userName", "");
      setValue("password", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchFullName, watchDepartment, setValue]);

  const onSubmit = async (data: AdminCreateFormValues) => {
    try {
      setIsLoading(true);
      const payload: AdminCreateRequest = {
        fullName: data.fullName,
        userName: data.userName,
        password: data.password,
        email: data.email,
        role: data.role,
        departmentId: data.department,
        departmentName:
          OPTIONS_DEPARTMENT.find((opt) => opt.value === data.department)
            ?.label || "",
        positionId: data.positions,
        positionName:
          OPTIONS_POSITIONS.find((opt) => opt.value === data.positions)
            ?.label || "",
      };
      await adminCreateUser(payload);
      setDsTaiKhoan((prev) => [...prev, payload]); // Cập nhật danh sách tài khoản mới để sẵn sàng export
      toast.success("Thêm nhân viên thành công!");
      setIsModalOpen(false);
      setRefreshKey((prev) => prev + 1); // Tự động cập nhật lại danh sách sau khi thêm thành công
      router.refresh();
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      toast.error("Đăng ký thất bại! Vui lòng thử lại.");

      if (axios.isAxiosError(error) && error.response?.status === 429) {
        // 1. Bắn thông báo cảnh cáo nghiêm túc
        alertService.error(
          "Hệ thống phát hiện hành vi spam dữ liệu liên tục! Bạn bị tạm khóa nút gửi trong 5 phút.",
        );

        // 2. Kích hoạt trạng thái khóa nút bấm
        setIsLoading(true);
        setCooldownTime(300); // 300 giây = 5 phút

        // 3. Chạy bộ đếm ngược hiển thị ra nút bấm
        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsLoading(false); // Mở khóa nút khi hết giờ
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return; // Thoát hàm, không chạy xuống finally
      }
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcelWithTemplate = async (
    dataNhanVien: AdminCreateRequest[],
  ) => {
    if (dataNhanVien.length === 0) return alert("Không có dữ liệu để xuất!");

    try {
      // 1. Tải file template từ thư mục public dưới dạng arraybuffer
      const response = await fetch("/templates/Template_Cap_Tai_Khoan.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      // 2. Khởi tạo workbook của ExcelJS và đọc file template
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ExcelJS = require("exceljs"); // Hoặc import ExcelJS from 'exceljs' ở đầu file
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      // 3. Lấy ra trang tính đầu tiên
      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) return alert("Không tìm thấy Sheet trong template!");

      // 4. Xác định dòng bắt đầu chèn dữ liệu
      const startRow = 4;

      dataNhanVien.forEach((user, index) => {
        // Lấy ra hàng hiện tại trong template (Ví dụ: hàng 4, hàng 5...)
        const currentRow = worksheet.getRow(startRow + index);

        if (currentRow) {
          // Điền dữ liệu vào từng ô nhưng VẪN GIỮ NGUYÊN STYLE của ô đó trong template
          currentRow.getCell(1).value = index + 1; // Cột A: STT
          currentRow.getCell(2).value = user.fullName?.trim() || ""; // Cột B: Họ và tên
          currentRow.getCell(3).value = user.email?.trim() || ""; // Cột C: Email
          currentRow.getCell(4).value = user.departmentName?.trim() || ""; // Cột D: Phòng ban
          currentRow.getCell(5).value = user.positionName?.trim() || ""; // Cột E: Chức vụ
          currentRow.getCell(6).value = user.userName?.trim() || ""; // Cột F: Tên đăng nhập
          currentRow.getCell(7).value = user.password?.trim() || ""; // Cột G: Mật khẩu

          // Lưu lại thay đổi trên hàng này
          currentRow.commit();
        }
      });

      // 5. Xuất file và kích hoạt tải xuống trên trình duyệt
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      const today = new Date().toLocaleDateString("vi-VN").replace(/\//g, "_");
      link.setAttribute("download", `Danh_sach_cap_tai_khoan_${today}.xlsx`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Lỗi xuất file Excel:", error);
      alert("Đã xảy ra lỗi khi xuất file!");
    }
  };

  const handleExport = () => {
    if (dsTaiKhoan.length === 0) {
      toast.warning("Vui lòng thêm ít nhất 1 tài khoản mới để xuất file CSV!");
      return;
    }
    exportToExcelWithTemplate(dsTaiKhoan);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-4">
        <DynamicBreadcrumb />
      <div className="flex items-center justify-between">
        <h1 className="text-sm md:text-2xl font-semibold">
          Danh sách Tài khoản
        </h1>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            className="text-sm font-semibold"
            onClick={handleExport}
          >
            + Export CSV
          </Button>
          <Guard requiredPermission={UserPermission.USER_CREATE}>
            <Button
              type="button"
              variant="primary"
              className="text-sm font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              + Thêm Người dùng
            </Button>
          </Guard>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="relative inline-block text-left">
          <DropDown
            label="Trạng thái"
            items={selectItems}
            value={viewMode}
            icon={<BiFilter className="w-4 h-4" />}
            onChange={(val) => setViewMode(val as FilterMode)}
          />
        </div>
      </div>
      {/* 🌟 TỐI ƯU KEY: Đổi key thành `viewMode` để tránh bảng bị re-mount vô cớ khi cùng số lượng phần tử */}
      <UserTable
        key={viewMode}
        rowsPerPage={20}
        data={users}
        // 🌟 TÁI SỬ DỤNG HÀM: Truyền hàm loadData dùng lại khi table thao tác thành công (ví dụ: toggleActive xong)
        onSuccess={() => setRefreshKey((prev) => prev + 1)} // Chạy ngầm cập nhật lại data mà không cần hiện loading screen che màn hình
        setDsTaiKhoan={setDsTaiKhoan} // Reset lại danh sách tài khoản mới sau khi đã xuất file xong để tránh nhầm lẫn
      />
      <Modal
        title=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-6 bg-white max-w-3xl mx-auto rounded-xl">
          <form
            method="post"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* 🟢 CỘT BÊN TRÁI: NHẬP THÔNG TIN CƠ BẢN */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                Thông tin cá nhân
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Họ và tên"
                  {...register("fullName", {
                    required: "Vui lòng nhập họ và tên",
                  })}
                  placeholder="Nhập họ và tên..."
                />
                {errors.fullName && (
                  <span className="text-red-500 text-[11px] mt-0.5 block">
                    {errors.fullName.message as string}
                  </span>
                )}

                <Input
                  label="Email"
                  type="email"
                  {...register("email", { required: "Vui lòng nhập email" })}
                  placeholder="Nhập email..."
                />
                {errors.email && (
                  <span className="text-red-500 text-[11px] mt-0.5 block">
                    {errors.email.message as string}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectField
                  label="Chức vụ"
                  options={OPTIONS_POSITIONS}
                  {...register(`positions`, {
                    required: "Vui lòng nhập Chức vụ",
                  })}
                  error={errors.positions?.message}
                />
                <SelectField
                  label="Phòng ban trực thuộc"
                  options={OPTIONS_DEPARTMENT}
                  {...register(`department`, {
                    required: "Vui lòng nhập Phòng ban",
                  })}
                  error={errors.department?.message}
                />
                <SelectField
                  label="Role"
                  options={OPTIONS_ROLE}
                  {...register(`role`, { required: "Vui lòng nhập Role" })}
                  error={errors.role?.message}
                />
              </div>
            </div>
            {/* 🔵 CỘT BÊN PHẢI: HỆ THỐNG CẤP PHÁT TÀI KHOẢN TỰ ĐỘNG */}
            <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/50 flex flex-col justify-center gap-4">
              <div className="text-center border-b border-dashed border-slate-200 pb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md border border-indigo-100/50">
                  Tài khoản cấp phát hệ thống
                </span>
              </div>

              <div>
                <Input
                  label="Tên đăng nhập (Tự động sinh)"
                  disabled={true}
                  {...register("userName")}
                  placeholder="Chờ gõ họ tên..."
                  className="bg-white border-slate-200 font-mono text-indigo-600 font-bold shadow-inner"
                />
              </div>

              <div>
                <Input
                  label="Mật khẩu khởi tạo (Tự động sinh)"
                  disabled={true}
                  {...register("password")}
                  placeholder="Chờ gõ họ tên..."
                  className="bg-white border-slate-200 font-mono text-emerald-600 font-bold shadow-inner"
                />
              </div>

              <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-xl leading-relaxed">
                💡 <strong>Ghi chú bảo mật:</strong> Nhân viên sử dụng tài khoản
                này để đăng nhập hệ thống phà lần đầu và bắt buộc phải cập nhật
                lại mật khẩu cá nhân mới.
              </div>
            </div>
            {/* 🛠️ THANH HÀNH ĐỘNG FOOTER (Kéo dài hết cả 2 cột) */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
              <Button
                type="button"
                variant="secondary"
                className="px-5 font-semibold text-sm rounded-xl"
                onClick={() => setIsModalOpen(false)}
              >
                Quay lại
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-6 font-semibold text-sm rounded-xl shadow-md min-w-37.5"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đăng ký thành viên"}
                {cooldownTime > 0 &&
                  ` (${Math.floor(cooldownTime / 60)}p:${cooldownTime % 60}s)`}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
