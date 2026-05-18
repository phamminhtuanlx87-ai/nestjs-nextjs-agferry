"use client";
import React from "react";
import { GiaiDoanDto, ProjectFormData } from "../ProjectFormData";
import Input from "@/components/ui/Input";
import { useFormContext } from "react-hook-form";
import { useCongTrinh } from "@/context/CongTrinhContext";
import { SelectField } from "@/components/ui/SelectField";
import { MA_HIEU_MAPPING } from "../GiaiDoan";
import { formatCurrency } from "@/utils/formatnumber";
import { MultiFileControl } from "@/components/ui/MultiFile";

interface Props {
  stage: GiaiDoanDto[];
}

// ĐỊNH NGHĨA DANH SÁCH Ở ĐÂY CHO DỄ TÌM
const OPTIONS_DU_TOAN = [{ value: "PDT", label: "Phòng Đầu tư" }];

export default function QuyetToanForm({ stage }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();

  return (
    <div>
      {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[7].ma_hieu) && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tiêu đề khối */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
            <h3 className="font-bold text-blue-800 text-sm uppercase">
              VII. Quyết toán{" "}
              <span className="hidden">{data?.ten_cong_trinh}</span>
            </h3>
            <span className="text-[10px] text-gray-400 italic font-medium">
              Đơn vị: VNĐ
            </span>
          </div>

          <div className="p-5 space-y-8">
            {/* Nhánh Dự toán */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Ngày quyết toán"
                  type="date"
                  {...register(`giai_doan.8.ngay_thuc_hien`, {
                    required: "Vui lòng nhập Ngày quyết toán",
                  })}
                  error={errors.giai_doan?.[8]?.ngay_thuc_hien?.message}
                />

                <Input
                  label="Tổng giá quyết toán"
                  type="text"
                  {...register(`giai_doan.8.tong_gia_tri`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required: "Vui lòng nhập Tổng giá quyết toán",
                  })}
                  error={errors.giai_doan?.[8]?.tong_gia_tri?.message}
                />

                <Input
                  label="Tổng chi phí Xây dựng"
                  type="text"
                  {...register(`giai_doan.8.chi_phi_xay_dung`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required: "Vui lòng nhập Tổng chi phí Xây dựng",
                  })}
                  error={errors.giai_doan?.[8]?.chi_phi_xay_dung?.message}
                />

                <SelectField
                  label="Đơn vị"
                  options={OPTIONS_DU_TOAN}
                  {...register(`giai_doan.8.ma_don_vi`, {
                    required: "Vui lòng nhập đơn vị",
                  })}
                  error={errors.giai_doan?.[8]?.ma_don_vi?.message}
                ></SelectField>
                <MultiFileControl
                  control={control}
                  // name phải khớp với index của giai đoạn (ví dụ giai đoạn Dự toán thường là index 0)
                  name="giai_doan.6.file_links"
                  label="Danh sách tài liệu đính kèm"
                />
              </div>
            </div>

            {/* <div className="border-t border-dashed border-slate-200" /> */}
          </div>
        </div>
      )}
    </div>
  );
}
