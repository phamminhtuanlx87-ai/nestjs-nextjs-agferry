"use client";

import { Guard } from "@/components/common/Guard";
import UserTable, { IUser } from "@/components/modules/nhan-vien/UserTable";
import Button from "@/components/ui/Button";
import DropDown from "@/components/ui/DropDown";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getAllUsers } from "@/services/authService";
import { UserPermission } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";

type FilterMode = "all" | "active" | "inactive";

export default function NhanVienPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [viewMode, setViewMode] = useState<FilterMode>("all");
  // 🌟 Sửa lại tên biến đồng bộ cho chuẩn quy ước React [x, setX]
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const selectItems = [
    { value: "all", label: "Tất cả" },
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Chưa kích hoạt" },
  ];

  // // 🌟 GỘP LOGIC: Hàm nạp dữ liệu duy nhất dùng chung cho cả trang
  // const loadData = useCallback(async (mode: FilterMode) => {
  //   try {
  //     setIsLoading(true);
  //     const res = await getAllUsers(mode);
  //     setUsers(res || []);
  //   } catch (error) {
  //     console.error("Lỗi khi tải danh sách nhân viên:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

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

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-sm md:text-2xl font-semibold">
          Danh sách Tài khoản
        </h1>
        <Guard requiredPermission={UserPermission.USER_CREATE}>
          <Button
            type="button"
            variant="primary"
            className="text-sm font-semibold"
            // onClick={() => setIsModalOpen(true)}
          >
            + Thêm Người dùng
          </Button>
        </Guard>
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
      />
    </div>
  );
}
