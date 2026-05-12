import React from "react";
import { GiaiDoanDto, ProjectFormData } from "../ProjectFormData";
import { useFormContext } from "react-hook-form";
import { formatCurrency } from "@/utils/formatnumber";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { useCongTrinh } from "@/context/CongTrinhContext";
import { MA_HIEU_MAPPING } from "../GiaiDoan";

interface Props {
  stage: GiaiDoanDto[];
}

const OPTIONS_DU_TOAN = [{ value: "PDT", label: "Phòng Đầu tư" }];

export default function PDDuToanForm({ stage }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();
  return (
    <div>
      {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[1].ma_hieu) && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tiêu đề khối */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
            <h3 className="font-bold text-blue-800 text-sm uppercase">
              III. Quyết định phê duyệt Dự toán: <span className="hidden"> {data?.ten_cong_trinh}</span>
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
                  label="Ngày Quyết định Phê duyệt Dự toán"
                  type="date"
                  {...register(`giai_doan.2.ngay_thuc_hien`, {
                    required: "Vui lòng nhập ngày lập dự toán",
                  })}
                  error={errors.giai_doan?.[2]?.ngay_thuc_hien?.message}
                />

                <Input
                  label="Tổng giá trị phê duyệt"
                  type="text"
                  placeholder="0"
                  {...register(`giai_doan.2.tong_gia_tri`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required: "Vui lòng nhập tổng giá trị dự toán",
                  })}
                  error={errors.giai_doan?.[2]?.tong_gia_tri?.message}
                />

                <Input
                  label="Tổng chi phí Xây dựng"
                  type="text"
                  placeholder="0"
                  {...register(`giai_doan.2.chi_phi_xay_dung`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required: "Vui lòng nhập tổng giá trị dự toán",
                  })}
                  error={errors.giai_doan?.[2]?.chi_phi_xay_dung?.message}
                />

                <SelectField
                  label="Đơn vị"
                  options={OPTIONS_DU_TOAN}
                  {...register(`giai_doan.2.ma_don_vi`, {
                    required: "Vui lòng nhập đơn vị lập dự toán",
                  })}
                  error={errors.giai_doan?.[2]?.ma_don_vi?.message}
                ></SelectField>
              </div>
            </div>

            {/* <div className="border-t border-dashed border-slate-200" /> */}
          </div>
        </div>
      )}
    </div>
  );
}
