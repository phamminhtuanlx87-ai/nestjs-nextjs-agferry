"use client";
import { projectStatusMap } from "./ProjectStatus";
import { useRouter } from "next/navigation";
import { ICongTrinh } from "@/services/congTrinhService";
import api from "@/lib/axios";
import { alertService } from "@/utils/swal";
import { useState } from "react";
import ResponsivePagination from "@/components/ui/ResponsivePagination";
import { formatMoney } from "@/utils/formatnumber";
import ProjectActions from "./ProjectActions";

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

  return (
    <div>
      {dsCongTrinh?.slice(start, end).map((project) => (
        <div key={project.ma_cong_trinh}>
          <div className="card-soft w-full min-h-34 mt-4 p-3">
            {/* header  card*/}
            <div className="flex justify-between items-center">
              <div className="flex flex-col sm:flex-row text-[10px] mb-2 font-bold text-slate-500 tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
                {/* 1. Phiên bản cho màn hình SIÊU NHỎ: Mặc định hiện, lên sm sẽ ẩn (hidden) */}
                <span className="sm:hidden">Mã C.trình: </span>

                {/* 2. Phiên bản từ màn hình SM trở lên: Mặc định ẩn (hidden), lên sm sẽ hiện (sm:inline) */}
                <span className="hidden sm:inline">Mã công trình: </span>
                <span className="text-indigo-600">
                  {" "}
                  {project?.ma_cong_trinh ?? ""}
                </span>
              </div>
              <span>
                {renderStatus(project.giai_doan?.at(-1)?.ma_hieu ?? "")}
              </span>
            </div>

            {/* MAIN CARD */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                {/* Tên công trình: Chữ to, rõ ràng, border nhẹ tách biệt */}
                <h3 className="font-semibold text-gray-800 text-sm md:text-base line-clamp-2">
                  {project.ten_cong_trinh}
                </h3>
                {/* Ngày tạo */}
                <div className="text-xs text-gray-400 font-medium hidden lg:inline">
                  📅 <span className="hidden sm:inline">Ngày tạo dự án: </span>
                  <span className="text-slate-600">
                    {project.ngay_tao_du_an
                      ? new Date(project.ngay_tao_du_an).toLocaleDateString(
                          "vi-VN",
                        )
                      : "---"}
                  </span>
                </div>
              </div>
              <hr className="my-2 border-gray-200" />

              {/* Lưới hiển thị số liệu: Mobile đi hàng dọc hoặc hàng ngang linh hoạt */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs md:text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-400 font-medium">
                    Dự toán được duyệt
                  </span>
                  {/* Màn hình siêu nhỏ chỉ hiển thị 1 thông tin */}
                  <span className="sm:hidden text-gray-700 font-bold mt-0.5">
                    {formatMoney(
                      (project.giai_doan[7]?.tong_gia_tri as string) ??
                        (project.giai_doan[2]?.tong_gia_tri as string) ??
                        "0",
                    )}
                  </span>
                  {/* Màn hình sm >*/}
                  <span className="hidden sm:inline text-gray-700 font-bold mt-0.5">
                    {formatMoney(
                      (project.giai_doan[2]?.tong_gia_tri as string) ?? "0",
                    )}
                  </span>
                </div>
                {/* Màn hình sm >*/}
                <div className="hidden sm:flex flex-col">
                  <span className="text-gray-400 font-medium">
                    Dự toán Phát sinh được duyệt
                  </span>
                  <span className=" text-gray-700 font-bold mt-0.5">
                    {formatMoney(
                      (project.giai_doan[7]?.tong_gia_tri as string) ?? "0",
                    )}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-400 font-medium">Quyết toán</span>
                  <span className="text-gray-700 font-bold mt-0.5">
                    {formatMoney(
                      (project.giai_doan[8]?.tong_gia_tri as string) ?? "0",
                    )}
                  </span>
                </div>
                <div className="hidden lg:inline">
                  <ProjectActions
                    project={project}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            </div>

            {/* footer card */}
            <hr className="my-2 border-gray-200" />

            <div className="flex justify-between items-center lg:hidden">
              {/* Ngày tạo */}
              <div className="text-xs text-gray-400 font-medium">
                📅 <span className="hidden sm:inline">Ngày tạo dự án: </span>
                <span className="text-slate-600">
                  {project.ngay_tao_du_an
                    ? new Date(project.ngay_tao_du_an).toLocaleDateString(
                        "vi-VN",
                      )
                    : "---"}
                </span>
              </div>

              <ProjectActions
                project={project}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      ))}

      {/* INFO + PAGINATION */}
      <ResponsivePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        setCurrentPage={setCurrentPage}
        itemsPerPage={rowsPerPage}
      />
    </div>
  );
}
