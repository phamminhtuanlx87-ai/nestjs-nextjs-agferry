// Tên file: GeneralInfo.tsx
"use client";
import { useFormContext } from "react-hook-form";
import { ProjectFormData } from "../ProjectFormData";
import Input from "@/components/ui/Input";
import { useCongTrinh } from "@/context/CongTrinhContext";

// ĐỊNH NGHĨA DANH SÁCH Ở ĐÂY CHO DỄ TÌM
// const OPTIONS_DU_TOAN = [{ value: "PKT", label: "Phòng Kỹ thuật - Vật tư" }];

export function TongQuanForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();
  // 2. Sử dụng data để khởi tạo Form (nếu dùng react-hook-form)
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Tiêu đề khối */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
        <h3 className="font-bold text-blue-800 text-sm uppercase">
          I. Thông tin chung: {data?.ten_cong_trinh}
        </h3>
        <span className="text-[10px] text-gray-400 italic font-medium"></span>
      </div>

      <div className="p-5 space-y-8">
        {/* Nhánh Dự toán */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1 w-full">
              <Input
                label="ĐƠN VỊ CHỦ QUẢN"
                {...register("don_vi_chu_quan", {
                  required: "Vui lòng nhập đơn vị chủ quản",
                })}
                defaultValue={data?.don_vi_chu_quan || "Cty Cổ phần Phà An Giang"} // Giá trị mặc định nếu không có data
                placeholder="Nhập đơn vị chủ quản..."
                error={errors.don_vi_chu_quan?.message}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Input
                label="TÊN CÔNG TRÌNH"
                {...register("ten_cong_trinh", {
                  required: "Vui lòng nhập tên công trình",
                })}
                placeholder="Nhập tên công trình..."
                error={errors.ten_cong_trinh?.message}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Input
                label="Ngày tạo"
                {...register("ngay_tao_du_an", {
                  required: "Vui lòng nhập ngày tạo",
                })}
                type="date"
                error={errors.ngay_tao_du_an?.message}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
