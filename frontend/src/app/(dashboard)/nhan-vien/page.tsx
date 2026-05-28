"use client";
import { Guard } from "@/components/common/Guard";
import UserTable, { IUser } from "@/components/modules/nhan-vien/UserTable";
import Button from "@/components/ui/Button";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { getAllUsers } from "@/services/authService";
import { UserPermission } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";

export default function NhanVienPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const res = await getAllUsers();
        setUsers(res || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);
  if (loading) return <LoadingScreen />;
  return (
    <div>
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
      <UserTable key={users.length} rowsPerPage={5} data={users} />
    </div>
  );
}
