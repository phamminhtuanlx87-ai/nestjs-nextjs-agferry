"use client";
import { Guard } from "@/components/common/Guard";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import { UserPermission } from "@/store/useAuthStore";
import { RiDeleteBinLine, RiEdit2Line, RiEyeLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export interface IUser {
  id: string;
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
  key: number; // Để reset state khi có thay đổi dữ liệu
  rowsPerPage?: number;
  data: IUser[];
//   onSuccess?: () => void;
}

function UserTable({ rowsPerPage = 5, data: users }: UserTable) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const totalItems = users?.length;
  const totalPages = Math.ceil(Number(totalItems) / rowsPerPage);

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
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Đang hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 shadow-sm">
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
                    onClick={() => {
                      const targetId = user.userName;
                      router.push(`/nhan-vien/${targetId}`);
                    }}
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
    </div>
  );
}

export default UserTable;
