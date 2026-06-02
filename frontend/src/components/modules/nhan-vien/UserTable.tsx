"use client";
import { Guard } from "@/components/common/Guard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { SelectField } from "@/components/ui/SelectField";
import Table from "@/components/ui/Table";
import {
  AdminCreateFormValues,
  AdminCreateRequest,
  adminGetUserByID,
  adminUpdateUser,
  toggleActive,
} from "@/services/authService";
import { UserPermission } from "@/store/useAuthStore";
import { alertService } from "@/utils/swal";
import { RiDeleteBinLine, RiEdit2Line, RiEyeLine } from "@remixicon/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface IUser {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  department: {
    id: string;
    name: string;
  };
  positions: {
    id: string;
    name: string;
  };
  isActive: boolean;
}

interface UserTable {
  key: string; // Để reset state khi có thay đổi dữ liệu
  rowsPerPage?: number;
  data: IUser[];
  onSuccess?: () => void;
  setDsTaiKhoan: React.Dispatch<React.SetStateAction<AdminCreateRequest[]>>;
}

function UserTable({ rowsPerPage = 5, data: users, onSuccess, setDsTaiKhoan }: UserTable) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const totalItems = users?.length;
  const totalPages = Math.ceil(Number(totalItems) / rowsPerPage);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [userIdToUpdate, setUserIdToUpdate] = useState<string>(""); // Lưu ID của user đang được cập nhật
  const {
    register,
    handleSubmit,
    setValue,
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
  const TABLE_HEADERS = [
    { label: "Tên tài khoản", key: "userName", className: "min-w-[125px]" },
    {
      label: "Họ và Tên",
      key: "fullName",
      className: "min-w-[200px]",
      align: "left" as const,
    },
    { label: "Email", key: "email", align: "left" as const },
    {
      label: "Phòng ban",
      key: "department",
      className: "min-w-[150px]",
      align: "left" as const,
    }, // Căn phải cho số tiền
    {
      label: "Chức vụ",
      key: "positions",
      className: "min-w-[150px]",
      align: "left" as const,
    }, // Căn phải cho số tiền
    {
      label: "Trạng thái",
      key: "isActive",
      className: "min-w-[150px]",
      align: "center" as const,
    },
    { label: "Hành động", key: "actions", align: "center" as const },
  ];

  const generateRandomPassword = (length = 10): string => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  };

  const handleClick = async (
    userId: string,
    currentStatus: boolean,
    userName: string,
  ) => {
    if (!userId) return;

    // 1. Tạo nội dung cảnh báo dựa trên trạng thái hiện tại của user
    const actionText = currentStatus ? "NGỪNG HOẠT ĐỘNG" : "KÍCH HOẠT";

    // 2. Gọi hộp thoại SweetAlert2 hỏi xác nhận

    const result = await alertService.confirmToggleActive({
      title: `Xác nhận ${actionText.toLowerCase()} người dùng ${userName}?`,
      itemCode: actionText.toLowerCase(),
      itemName: userName,
    });
    // Nếu người dùng bấm "Hủy bỏ", dừng toàn bộ logic bên dưới lại, không gọi API nữa
    if (!result.isConfirmed) return;

    try {
      await toggleActive(userId);
      alertService.success(
        `Đã ${actionText.toLowerCase()} nhân viên ${userName} thành công!`,
      );
      onSuccess?.();
      router.refresh();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái nhân viên:", error);
      alertService.error("Có lỗi xảy ra trong quá trình xử lý.");
    }
  };

  const onSubmit = async (data: AdminCreateFormValues) => {
    try {
      const payload: AdminCreateRequest = {
        id: userIdToUpdate || "",
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
      await adminUpdateUser(payload);
      toast.success("Cập nhật nhân viên thành công!");
     setDsTaiKhoan((prev) => [...prev, payload]);
      onSuccess?.();
      setIsModalOpen(false);
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

  const handleUpdateClick = async (id: string) => {
    // 1. Mở modal
    setIsModalOpen(true);
    // 2. Reset form và điền sẵn dữ liệu mặc định (nếu cần)
    try {
      const userData = await adminGetUserByID(id);
      setUserIdToUpdate(id); // Lưu ID của user đang được cập nhật vào state
      setValue("fullName", userData.fullName);
      setValue("email", userData.email);
      setValue("department", userData.department?.id || "");
      setValue("positions", userData.positions?.id || "");
      setValue("role", userData.role);
      setValue("password", userData.password);
      setValue("userName", userData.userName);
      // Lưu ý: userName và password thường không được phép chỉnh sửa, nên có thể không cần setValue cho 2 trường này
    } catch (error) {
      console.error("Lỗi khi reset form:", error);
    }
  };
  return (
    <div>
      <Table headers={TABLE_HEADERS}>
        {users?.slice(start, end).map((user) => (
          <tr
            key={user.userName}
            className="hover:bg-indigo-100 transition-colors"
          >
            <td className="px-6 py-4 hidden md:table-cell font-medium">
              <span className="text-blue-500">@{user.userName}</span>
            </td>

            <td className="px-6 py-4  text-gray-800 font-bold">
              {user.fullName}
            </td>
            <td className="px-6 py-4 hidden md:table-cell text-left">
              {user.email}
            </td>

            <td className="px-6 py-4 text-left tabular-nums">
              {user.department.name}
            </td>

            <td className="px-6 py-4 hidden md:table-cell text-left tabular-nums">
              {user.positions.name}
            </td>

            <td className="px-6 py-4 hidden md:table-cell text-center tabular-nums ">
              {user?.isActive !== undefined ? (
                user.isActive ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // 🌟 Chặn nổi bọt sự kiện click hàng
                      handleClick(
                        user._id || "",
                        !!user.isActive,
                        user.fullName || "",
                      );
                    }}
                    className="hover:scale-110 cursor-pointer inline-flex items-center gap-1.5 text-xs text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang hoạt động
                  </span>
                ) : (
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // 🌟 Chặn nổi bọt sự kiện click hàng
                      handleClick(
                        user._id || "",
                        !!user.isActive,
                        user.fullName || "",
                      );
                    }}
                    className="hover:scale-110 cursor-pointer inline-flex items-center gap-1.5 text-xs text-rose-700 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 shadow-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Chưa kích hoạt
                  </span>
                )
              ) : (
                <span className="text-xs text-slate-400 font-medium animate-pulse">
                  Đang kiểm tra...
                </span>
              )}
            </td>

            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <Guard requiredPermission={UserPermission.USER_VIEW}>
                  <Button
                    type="button"
                    className="p-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-300 transition-colors"
                    onClick={() => {
                      const targetId = user.userName;
                      router.push(`/nhan-vien/${targetId}/view`);
                    }}
                  >
                    <RiEyeLine size={18}></RiEyeLine>
                  </Button>
                </Guard>
                <Guard requiredPermission={UserPermission.PROJECT_UPDATE}>
                  <Button
                    type="button"
                    className="p-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-300 transition-colors"
                    onClick={() => handleUpdateClick(user._id || "")}
                  >
                    <RiEdit2Line size={18}></RiEdit2Line>
                  </Button>
                </Guard>
                <Guard requiredPermission={UserPermission.PROJECT_DELETE}>
                  <Button
                    type="button"
                    className="p-2 rounded-lg text-red-500 bg-white hover:bg-indigo-300 transition-colors"
                    // onClick={() =>
                    //   handleDelete(
                    //     project._id,
                    //     project.ma_cong_trinh,
                    //     project.ten_cong_trinh,
                    //   )
                    // }
                  >
                    <RiDeleteBinLine size={18}></RiDeleteBinLine>
                  </Button>
                </Guard>
              </div>
            </td>
          </tr>
        ))}
      </Table>
      {/* INFO + PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Hiển thị {start + 1} - {Math.min(end, Number(totalItems))} của{" "}
          {totalItems} công trình
        </p>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            ›
          </button>
        </div>
      </div>
      <Modal
        title=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-6 bg-white max-w-3xl mx-auto rounded-xl">
          <form
            method="patch"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* 🟢 CỘT BÊN TRÁI: NHẬP THÔNG TIN CƠ BẢN */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                Chỉnh sửa thông tin nhân viên
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

              <div className="relative w-full group">
                {/* 1. Thanh Input chính */}
                <Input
                  label="Mật khẩu khởi tạo (Tự động sinh)"
                  disabled={true}
                  {...register("password")}
                  placeholder="Chờ gõ họ tên..."
                  // pr-20 chừa khoảng trống 80px bên phải để chữ không chạm vào nút
                  className="bg-white border-slate-200 font-mono text-emerald-600 font-bold shadow-inner pr-20 transition-all duration-300 focus:border-indigo-500"
                />

                {/* 2. Nút bấm căn chỉnh lại tọa độ hợp lý */}
                <button
                  type="button"
                  className="mt-2 absolute right-2.5 top-9.5 px-2 py-1 text-sm text-indigo-600 font-medium 
               bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200
               border border-indigo-200 rounded transition-all duration-200 
               flex items-center gap-1 focus:outline-none select-none
               hover:scale-105 active:scale-95 shadow-sm"
                  onClick={() => {
                    const newPassword = generateRandomPassword(10);
                    setValue("password", newPassword, { shouldValidate: true });
                  }}
                >
                  <span>🔑</span> Đổi mã
                </button>
              </div>

              <div className="mt-6 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-xl leading-relaxed">
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
                {isLoading ? "Đang xử lý..." : "Cập nhật thành viên"}
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

export default UserTable;
