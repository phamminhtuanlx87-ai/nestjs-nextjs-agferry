"use client";
import Table from "@/components/ui/Table";
import { projectStatusMap } from "./ProjectStatus";
import { RiDeleteBinLine, RiEdit2Line, RiEyeLine } from "@remixicon/react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { ICongTrinh } from "@/services/congTrinhService";
import api from "@/lib/axios";
import { alertService } from "@/utils/swal";
import { useState } from "react";
import { Guard } from "@/components/common/Guard";
import { UserPermission } from "@/store/useAuthStore";

interface CongTrinhTableProps {
  // projects: ICongTrinh[];
  key: number; // Để reset state khi có thay đổi dữ liệu
  rowsPerPage?: number;
  data: ICongTrinh[];
  onSuccess?: () => void;
}

export default function CongTrinhTable({
  rowsPerPage = 5,
  data: dsCongTrinh,
  onSuccess,
}: CongTrinhTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const totalItems = dsCongTrinh?.length;
  const totalPages = Math.ceil(Number(totalItems) / rowsPerPage);

  function renderStatus(statusId: string) {
    const status = projectStatusMap[statusId];
    if (!status) return null;
    return (
      <span
        className={`inline-flex items-center justify-center min-w-28 px-3 py-1 text-xs font-medium rounded-full ${status.color}`}
        title={status.full}
      >
        {status.short}
      </span>
    );
  }

  const handleDelete = async (
    targetId: string,
    projectCode: string,
    projectName: string,
  ) => {
    // Gọi hàm confirm đã thiết kế sẵn
    const result = await alertService.confirmDelete({
      title: "Xác nhận xóa công trình",
      itemCode: projectCode,
      itemName: projectName,
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/congtrinh/${targetId}/soft-delete`);

        // Hiện thông báo thành công nhanh gọn
        alertService.success("Đã xóa công trình thành công!");

        onSuccess?.();
        router.refresh();
      } catch (error) {
        // Hiện thông báo lỗi
        alertService.error("Có lỗi xảy ra khi xóa!" + error);
      }
    }
  };

  const TABLE_HEADERS = [
    {
      label: "Mã CT",
      key: "ma_cong_trinh",
      className: "hidden 2xl:table-cell text-center min-w-20",
    },
    {
      label: "Tên công trình",
      key: "ten_cong_trinh",
      className: "min-w-50 wrap-break-word",
    },
    {
      label: "Ngày khởi tạo",
      key: "ngay_tao_du_an",
      className: "hidden md:table-cell",
      align: "center" as const,
    },
    {
      label: "Dự toán\nđược duyệt",
      key: "du_toan",
      className:
        "min-w-20 whitespace-pre-line leading-snug  hidden 2xl:table-cell",
      align: "center" as const,
    }, // Căn phải cho số tiền
    {
      label: "Dự toán (Điều chỉnh)\nđược duyệt",
      key: "du_toan_dc",
      className:
        "min-w-20 whitespace-pre-line leading-snug hidden 2xl:table-cell",
      align: "center" as const,
    }, // Căn phải cho số tiền
    {
      label: "Quyết toán",
      key: "quyet_toan",
      className: "min-w-20 hidden lg:table-cell",
      align: "right" as const,
    }, // Căn phải
    {
      label: "Trạng thái",
      key: "trang_thai",
      className: "text-center max-w-16",
      align: "center" as const,
    },
    {
      label: "Hành động",
      key: "actions",
      className: "",
      align: "center" as const,
    },
  ];
  return (
    <div>
      <Table headers={TABLE_HEADERS}>
        {dsCongTrinh?.slice(start, end).map((project) => (
          <tr
            key={project._id}
            className="hover:bg-indigo-100 transition-colors "
          >
            <td className="px-6 py-4 font-medium hidden 2xl:table-cell ">
              {project.ma_cong_trinh}
            </td>

            <td className="px-6 py-4 text-gray-800 font-bold min-w-50 max-w-40 wrap-break-word">
              {project.ten_cong_trinh}
            </td>
            <td className="px-6 py-4 hidden md:table-cell text-center">
              {project.ngay_tao_du_an
                ? new Date(project.ngay_tao_du_an).toLocaleDateString("vi-VN")
                : "---"}
            </td>

            <td className="px-6 py-4 text-right tabular-nums hidden 2xl:table-cell">
              {/* Dùng Number() để ép kiểu về số trước khi format, mặc định là 0 nếu null */}
              {Number(
                project.giai_doan?.find((gd) => gd.ma_hieu === "PD_DT")
                  ?.tong_gia_tri || 0,
              ).toLocaleString("vi-VN")}
              <span className="text-gray-400 text-xs"> ₫</span>
            </td>

            <td className="px-6 py-4 hidden 2xl:table-cell text-right tabular-nums">
              {Number(
                project.giai_doan?.find((gd) => gd.ma_hieu === "PD_DT_PS")
                  ?.tong_gia_tri || 0,
              ).toLocaleString("vi-VN")}
              <span className="text-gray-400 text-xs"> ₫</span>
            </td>
            <td className="px-6 py-4 hidden lg:table-cell text-right tabular-nums font-semibold">
              {Number(
                project.giai_doan?.find((gd) => gd.ma_hieu === "QT")
                  ?.tong_gia_tri || 0,
              ).toLocaleString("vi-VN")}
              <span className="text-gray-400 text-xs"> ₫</span>
            </td>
            <td className="text-center px-6 py-4">
              {renderStatus(project.giai_doan?.at(-1)?.ma_hieu || "")}
            </td>

            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-1">
                <Guard requiredPermission={UserPermission.PROJECT_VIEW}>
                  <Button
                    type="button"
                    className="p-2 rounded-lg text-indigo-600 bg-white hover:bg-indigo-300 transition-colors"
                    onClick={() => {
                      const targetId = project._id;
                      router.push(`/cong-trinh/${targetId}/view`);
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
                      const targetId = project._id;
                      router.push(`/cong-trinh/${targetId}`);
                    }}
                  >
                    <RiEdit2Line size={18}></RiEdit2Line>
                  </Button>
                </Guard>
                <Guard requiredPermission={UserPermission.PROJECT_DELETE}>
                  <Button
                    type="button"
                    className="p-2 rounded-lg text-red-500 bg-white hover:bg-indigo-300 transition-colors"
                    onClick={() =>
                      handleDelete(
                        project._id,
                        project.ma_cong_trinh,
                        project.ten_cong_trinh,
                      )
                    }
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
