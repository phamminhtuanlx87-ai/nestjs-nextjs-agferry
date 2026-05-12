"use client";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { useFormContext } from "react-hook-form";
import { GiaiDoanDto, ProjectFormData } from "../ProjectFormData";
import { useCongTrinh } from "@/context/CongTrinhContext";
import { formatCurrency } from "@/utils/formatnumber";
import { MA_HIEU_MAPPING } from "../GiaiDoan";
// ĐỊNH NGHĨA DANH SÁCH Ở ĐÂY CHO DỄ TÌM
const OPTIONS_DU_TOAN = [
  { value: "KTC", label: "Cty CP Tư vấn Xây dựng giao thông KTC" },
  { value: "SR", label: "Cty TNHH Thiết kế Soài Rạp" },
];

const OPTIONS_THAM_TRA = [
  { value: "TNB", label: "Cty TNHH Tư vấn Xây dựng Tây Nam Bộ" },
  { value: "TP", label: "Cty TNHH TV Thiết kế Xây dựng Trường Phú" },
];

interface Props {
  stage: GiaiDoanDto[];
}

export function DuToanForm({ stage }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Tiêu đề khối */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
          <h3 className="font-bold text-sm uppercase text-blue-800">
            II. Dự toán & Thẩm tra: <span className="hidden">{data?.ten_cong_trinh}</span>
          </h3>
          <span className="text-[10px] text-gray-400 italic font-medium">
            Đơn vị: VNĐ
          </span>
        </div>

        <div className="p-5 space-y-8">
          {/* Nhánh Dự toán */}
          <div>
            <div className="flex items-center mb-4 text-amber-900">
              <span className="bg-amber-900 w-1 h-4 mr-2 rounded-full"></span>
              <span className="text-sm font-bold uppercase">Dự toán</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <>
                <Input
                  label="Ngày lập dự toán"
                  type="date"
                  {...register(`giai_doan.0.ngay_thuc_hien`, {
                    required: "Vui lòng nhập ngày lập dự toán",
                  })}
                  error={errors.giai_doan?.[0]?.ngay_thuc_hien?.message}
                />
                <Input
                  label="Tổng giá trị dự toán"
                  type="text"
                  placeholder="0"
                  {...register(`giai_doan.0.tong_gia_tri`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required: "Vui lòng nhập tổng giá trị dự toán",
                  })}
                  error={errors.giai_doan?.[0]?.tong_gia_tri?.message}
                />
                <Input
                  label="Tổng chi phí xây dựng"
                  type="text"
                  placeholder="0"
                  {...register(`giai_doan.0.chi_phi_xay_dung`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required: "Vui lòng nhập tổng chi phí xây dựng",
                  })}
                  error={errors.giai_doan?.[0]?.chi_phi_xay_dung?.message}
                />
                <SelectField
                  label="Đơn vị"
                  options={OPTIONS_DU_TOAN}
                  {...register(`giai_doan.0.ma_don_vi`, {
                    required: "Vui lòng nhập đơn vị lập dự toán",
                  })}
                  error={errors.giai_doan?.[0]?.ma_don_vi?.message}
                ></SelectField>
              </>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300" />

          {/* Nhánh Thẩm tra */}
          {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[0].ma_hieu) && (
            <div>
              <div className="flex items-center mb-4 text-blue-900">
                <span className="bg-blue-900 w-1 h-4 mr-2 rounded-full"></span>
                <span className="text-sm font-bold uppercase">
                  Thẩm tra dự toán:
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Ngày thẩm tra"
                  type="date"
                  {...register(`giai_doan.1.ngay_thuc_hien`, {
                    required: "Vui lòng nhập ngày thẩm tra dự toán",
                  })}
                  error={errors.giai_doan?.[1]?.ngay_thuc_hien?.message}
                />
                <Input
                  label="Tổng giá trị sau thẩm tra"
                  type="text"
                  placeholder="0"
                  {...register(`giai_doan.1.tong_gia_tri`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                  })}
                />
                <Input
                  label="Tổng chi phí Xây dựng"
                  type="text"
                  placeholder="0"
                  {...register(`giai_doan.1.chi_phi_xay_dung`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                  })}
                />
                <SelectField
                  label="Đơn vị"
                  options={OPTIONS_THAM_TRA}
                  {...register(`giai_doan.1.ma_don_vi`)}
                ></SelectField>
              </div>
            </div>
          )}
          {/* <div className="border-t border-dashed border-slate-300" /> */}
        </div>
      </div>
    </div>
  );
}
