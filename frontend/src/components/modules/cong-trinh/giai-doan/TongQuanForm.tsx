// Tên file: GeneralInfo.tsx
"use client";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { ProjectFormData } from "../ProjectFormData";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";

// ĐỊNH NGHĨA DANH SÁCH Ở ĐÂY CHO DỄ TÌM
const OPTIONS_DU_TOAN = [{ value: "PKT", label: "Phòng Kỹ thuật - Vật tư" }];

export const TongQuanForm = ({
  register,
  errors,
}: {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Tiêu đề khối */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
        <h3 className="font-bold text-blue-800 text-sm uppercase">
          I. Thông tin chung
        </h3>
        <span className="text-[10px] text-gray-400 italic font-medium"></span>
      </div>

      <div className="p-5 space-y-8">
        {/* Nhánh Dự toán */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* <div className="hidden">
              <Input
                label="id"
                {...register("id", {
                  required: "Vui lòng nhập mã công trình",
                })}
                placeholder="Nhập mã công trình..."
                disabled={true} // Vô hiệu hóa input
                style={{ display: "none" }}
              />
            </div> */}
            <div className="flex flex-col gap-1 w-full">
              <Input
                label="ĐƠN VỊ CHỦ QUẢN"
                {...register("donViChuQuan", {
                  required: "Vui lòng nhập đơn vị chủ quản",
                })}
                placeholder="Nhập đơn vị chủ quản..."
                error={errors.donViChuQuan?.message}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Input
                label="TÊN CÔNG TRÌNH"
                {...register("tenCongTrinh", {
                  required: "Vui lòng nhập tên công trình",
                })}
                placeholder="Nhập tên công trình..."
                error={errors.tenCongTrinh?.message}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Input
                label="Ngày tạo"
                {...register("ngayTao", {
                  required: "Vui lòng nhập ngày tạo",
                })}
                type="date"
                error={errors.ngayTao?.message}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <SelectField
                label="Đơn vị"
                options={OPTIONS_DU_TOAN}
                error={errors.donVi?.message} // Truyền message lỗi vào đây
                {...register("donVi", { required: "Vui lòng chọn đơn vị" })}
              />
            </div>
            {/* <div className="hidden">
              <Input
                label="Trạng thái"
                {...register("trangThai", {
                  required: "Vui lòng nhập trạng thái",
                })}
                defaultValue="DT"
                type="text"
                disabled={false}
                error={errors.trangThai?.message}
              />
            </div> */}
          </div>
        </div>

        {/* <div className="border-t border-dashed border-slate-200" /> */}
      </div>
    </div>
  );
};
