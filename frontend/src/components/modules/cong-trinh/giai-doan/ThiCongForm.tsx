"use client";
import React, { useEffect } from "react";
import { GiaiDoanDto, ProjectFormData } from "../ProjectFormData";
import { useFormContext } from "react-hook-form";
import { useCongTrinh } from "@/context/CongTrinhContext";
import { MA_HIEU_MAPPING } from "../GiaiDoan";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";

interface Props {
  stage: GiaiDoanDto[];
}
// ĐỊNH NGHĨA DANH SÁCH Ở ĐÂY CHO DỄ TÌM
const OPTIONS_DU_TOAN = [{ value: "XNCK", label: "XN Cơ khí Giao thông" }];
const OPTIONS_NGHIEM_THU = [
  { value: "PKT", label: "Phòng Kỹ thuật - Vật tư" },
  {
    value: "HHTN",
    label: "Cty TNHH Xây Dựng Thương Mại Công Nghiệp Hàng Hải Tây Nam",
  },
  { value: "TL", label: "Cty TNHH Thiết kế Công nghiệp Thắng Lợi" },
];

export default function ThiCongForm({ stage }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();

  // Theo dõi sự thay đổi của 2 ô input
  const ngayKhoiCong = watch("giai_doan.3.ngay_thuc_hien");
  const soNgayPGV = watch("giai_doan.3.so_ngay_tc_pgv");
  const ngayNghiemThu = watch("giai_doan.4.ngay_thuc_hien");

  useEffect(() => {
    if (ngayKhoiCong && soNgayPGV) {
      const start = new Date(ngayKhoiCong);
      const days = parseInt(soNgayPGV);

      if (!isNaN(start.getTime()) && !isNaN(days)) {
        // Cộng số ngày
        const resultDate = new Date(start);
        resultDate.setDate(resultDate.getDate() + days);

        // Định dạng lại thành YYYY-MM-DD để hiển thị lên input date
        const formattedDate = resultDate.toISOString().split("T")[0];

        // Cập nhật giá trị cho ô Ngày hoàn thành
        setValue("giai_doan.3.ngay_hoan_thanh", formattedDate);
      }
    }
    // 2. Logic tính Số ngày thi công thực tế
    // Giả sử: ngayNghiemThu là "giai_doan.3.ngay_nghiem_thu" (Tuấn thay đúng name nhé)
    if (ngayKhoiCong && ngayNghiemThu) {
      const start = new Date(ngayKhoiCong);
      const end = new Date(ngayNghiemThu);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Tính độ lệch miliseconds
        const diffTime = end.getTime() - start.getTime();
        // Chuyển đổi sang số ngày
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Cập nhật vào ô Số ngày thực tế (đảm bảo không âm)
        setValue(
          "giai_doan.4.so_ngay_tc_thuc_te",
          (diffDays >= 0 ? diffDays : 0).toString(),
        );
      }
    }
  }, [ngayKhoiCong, soNgayPGV, ngayNghiemThu, setValue]);
  return (
    <div>
      {/* Tiêu đề khối */}
      {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[2].ma_hieu) && (
        <>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
              <h3 className="font-bold text-sm uppercase text-blue-800">
                IV. Thi công & Nghiệm thu{" "}
                <span className="hidden">{data?.ten_cong_trinh}</span>
              </h3>
              <span className="text-[10px] text-gray-400 italic font-medium"></span>
            </div>
            <div className="p-5 space-y-8">
              <div className="flex items-center mb-4">
                <span className="bg-indigo-900 w-1 h-4 mr-2 rounded-full"></span>
                <span className="text-sm font-bold uppercase text-indigo-900">
                  Thi công
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Ngày khởi công"
                  type="date"
                  {...register(`giai_doan.3.ngay_thuc_hien`, {
                    required: "Vui lòng nhập ngày lập dự toán",
                  })}
                  error={errors.giai_doan?.[3]?.ngay_thuc_hien?.message}
                />

                <Input
                  label="Số ngày thi công (theo PGV)"
                  type="text"
                  {...register(`giai_doan.3.so_ngay_tc_pgv`, {
                    required:
                      "Vui lòng nhập số ngày thi công theo Phiếu giao việc",
                  })}
                  error={errors.giai_doan?.[3]?.so_ngay_tc_pgv?.message}
                />

                <Input
                  label="Ngày Hoàn thành (theo PGV)"
                  type="date"
                  readOnly
                  // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                  className="bg-gray-100 cursor-not-allowed opacity-70"
                  {...register(`giai_doan.3.ngay_hoan_thanh`, {
                    required: "Vui lòng nhập ngày lập dự toán",
                  })}
                  error={errors.giai_doan?.[3]?.ngay_hoan_thanh?.message}
                />

                <SelectField
                  label="Đơn vị Thi công"
                  options={OPTIONS_DU_TOAN}
                  {...register(`giai_doan.3.ma_don_vi`, {
                    required: "Vui lòng nhập đơn vị lập dự toán",
                  })}
                  error={errors.giai_doan?.[3]?.ma_don_vi?.message}
                ></SelectField>
              </div>
              <div className="border-t border-dashed border-slate-200 px-8" />
            </div>

            {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[3].ma_hieu) && (
              <>
                {/* Nhánh Nghiệm thu */}
                <div className="p-5 space-y-8">
                  <div className="flex items-center mb-4">
                    <span className="bg-emerald-900 w-1 h-4 mr-2 rounded-full"></span>
                    <span className="text-sm font-bold uppercase text-emerald-900">
                      Hồ sơ nghiệm thu
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      label="Ngày nghiệm thu"
                      type="date"
                      {...register(`giai_doan.4.ngay_thuc_hien`, {
                        required: "Vui lòng nhập ngày lập dự toán",
                      })}
                      error={errors.giai_doan?.[4]?.ngay_thuc_hien?.message}
                    />

                    <Input
                      label="Số ngày thi công thực tế"
                      type="text"
                      readOnly
                      // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                      className="bg-gray-100 cursor-not-allowed opacity-70"
                      {...register(`giai_doan.4.so_ngay_tc_thuc_te`, {
                        required: "Vui lòng nhập ngày lập dự toán",
                      })}
                      error={errors.giai_doan?.[4]?.so_ngay_tc_thuc_te?.message}
                    />

                    <SelectField
                      label="Đơn vị"
                      options={OPTIONS_NGHIEM_THU}
                      {...register(`giai_doan.4.ma_don_vi`, {
                        required: "Vui lòng nhập đơn vị lập dự toán",
                      })}
                      error={errors.giai_doan?.[4]?.ma_don_vi?.message}
                    ></SelectField>
                  </div>
                </div>
              </>
            )}
            <div className="border-t border-dashed border-slate-200" />
          </div>
        </>
      )}
    </div>
  );
}
