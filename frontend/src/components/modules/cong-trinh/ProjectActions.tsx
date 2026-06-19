"use client";
import { Guard } from "@/components/common/Guard";
import Button from "@/components/ui/Button";
import { ICongTrinh } from "@/services/congTrinhService";
import { UserPermission } from "@/store/useAuthStore";
import { RiDeleteBinLine, RiEdit2Line, RiEyeLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import React from "react";

// 1. Định nghĩa Interface cho các thuộc tính (Props) truyền vào component cụm nút
interface ProjectActionsProps {
  project: ICongTrinh; // Sau này anh thay "any" bằng Type dự án chuẩn của anh nhé
  handleDelete: (id: string, ma: string, ten: string) => void;
}
// 2. Gom cụm nút trùng lặp vào đây
const ProjectActions = ({
  project,
  handleDelete,
}: ProjectActionsProps) => {
    const router = useRouter()
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Guard requiredPermission={UserPermission.PROJECT_VIEW}>
        <Button
          type="button"
          className="rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 p-2 border border-gray-100 transition-colors"
          onClick={() => router.push(`/cong-trinh/${project._id}/view`)}
        >
          <RiEyeLine size={18} />
        </Button>
      </Guard>

      <Guard requiredPermission={UserPermission.PROJECT_UPDATE}>
        <Button
          type="button"
          className="rounded-lg text-amber-600 bg-white hover:bg-amber-50 p-2 border border-gray-100 transition-colors"
          onClick={() => router.push(`/cong-trinh/${project._id}`)}
        >
          <RiEdit2Line size={18} />
        </Button>
      </Guard>

      <Guard requiredPermission={UserPermission.PROJECT_DELETE}>
        <Button
          type="button"
          className="rounded-lg text-red-500 bg-white hover:bg-red-50 p-2 border border-gray-100 transition-colors"
          onClick={() =>
            handleDelete(
              project._id,
              project.ma_cong_trinh,
              project.ten_cong_trinh,
            )
          }
        >
          <RiDeleteBinLine size={18} />
        </Button>
      </Guard>
    </div>
  );
};

export default ProjectActions;
