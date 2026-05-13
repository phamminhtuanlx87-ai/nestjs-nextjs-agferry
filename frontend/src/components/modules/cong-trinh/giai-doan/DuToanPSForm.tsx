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
const OPTIONS_DU_TOAN = [
  { value: "KTC", label: "Cty CP Tư vấn Xây dựng giao thông KTC" },
  { value: "SR", label: "Cty TNHH Thiết kế Soài Rạp" },
];

const OPTIONS_THAM_TRA = [
  { value: "TNB", label: "Cty TNHH Tư vấn Xây dựng Tây Nam Bộ" },
  { value: "TP", label: "Cty TNHH TV Thiết kế Xây dựng Trường Phú" },
];
export default function DuToanPSForm({ stage }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();

  return (
    <div>
      {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[4].ma_hieu) && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Tiêu đề khối */}
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
            <h3 className="font-bold text-sm uppercase text-blue-800">
              V. Dự toán & Thẩm tra (Điều chỉnh){" "}
              <span className="hidden">{data?.ten_cong_trinh}</span>
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
                <span className="text-sm font-bold uppercase">
                  Dự toán (Điều chỉnh)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  label="Ngày lập dự toán"
                  type="date"
                  {...register(`giai_doan.5.ngay_thuc_hien`, {
                    required: "Vui lòng nhập ngày lập dự toán (Điều chỉnh)",
                  })}
                  error={errors.giai_doan?.[5]?.ngay_thuc_hien?.message}
                />

                <Input
                  label="Tổng giá trị dự toán (Điều chỉnh)"
                  type="text"
                  {...register(`giai_doan.5.tong_gia_tri`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required: "Vui lòng nhập Tổng giá trị dự toán (Điều chỉnh)",
                  })}
                  error={errors.giai_doan?.[5]?.tong_gia_tri?.message}
                />

                <Input
                  label="Tổng chi phí xây dựng (Điều chỉnh)"
                  type="text"
                  {...register(`giai_doan.5.chi_phi_xay_dung`, {
                    onChange: (e) => {
                      const formatted = formatCurrency(e.target.value);
                      e.target.value = formatted;
                    },
                    required:
                      "Vui lòng nhập Tổng chi phí xây dựng (Điều chỉnh)",
                  })}
                  error={errors.giai_doan?.[5]?.chi_phi_xay_dung?.message}
                />

                <SelectField
                  label="Đơn vị lập Dự toán (Điều chỉnh)"
                  options={OPTIONS_DU_TOAN}
                  {...register(`giai_doan.5.ma_don_vi`, {
                    required: "Vui lòng nhập đơn vị lập dự toán (Điều chỉnh)",
                  })}
                  error={errors.giai_doan?.[5]?.ma_don_vi?.message}
                ></SelectField>

                <MultiFileControl
                  control={control}
                  // name phải khớp với index của giai đoạn (ví dụ giai đoạn Dự toán thường là index 0)
                  name="giai_doan.5.file_links"
                  label="Danh sách tài liệu đính kèm"
                />
              </div>
            </div>

            <div className="border-t border-dashed border-slate-300" />

            {/* Nhánh Thẩm tra */}
            {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[5].ma_hieu) && (
              <div>
                <div className="flex items-center mb-4 text-blue-900">
                  <span className="bg-blue-900 w-1 h-4 mr-2 rounded-full"></span>
                  <span className="text-sm font-bold uppercase">
                    Thẩm tra dự toán (Điều chỉnh)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Ngày thẩm tra Dự toán (Điều chỉnh)"
                    type="date"
                    {...register(`giai_doan.6.ngay_thuc_hien`, {
                      required:
                        "Vui lòng nhập Ngày thẩm tra Dự toán (Điều chỉnh)",
                    })}
                    error={errors.giai_doan?.[6]?.ngay_thuc_hien?.message}
                  />

                  <Input
                    label="Tổng giá trị dự toán (Điều chỉnh) sau thẩm tra"
                    type="text"
                    {...register(`giai_doan.6.tong_gia_tri`, {
                      onChange: (e) => {
                        const formatted = formatCurrency(e.target.value);
                        e.target.value = formatted;
                      },
                      required:
                        "Vui lòng nhập Tổng giá trị dự toán (Điều chỉnh) ",
                    })}
                    error={errors.giai_doan?.[6]?.tong_gia_tri?.message}
                  />

                  <Input
                    label="Tổng chi phí xây dựng (Điều chỉnh)"
                    type="text"
                    {...register(`giai_doan.6.chi_phi_xay_dung`, {
                      onChange: (e) => {
                        const formatted = formatCurrency(e.target.value);
                        e.target.value = formatted;
                      },
                      required:
                        "Vui lòng nhập Tổng chi phí xây dựng (Điều chỉnh)",
                    })}
                    error={errors.giai_doan?.[6]?.chi_phi_xay_dung?.message}
                  />

                  <SelectField
                    label="Đơn vị"
                    options={OPTIONS_THAM_TRA}
                    {...register(`giai_doan.6.ma_don_vi`, {
                      required: "Vui lòng nhập đơn vị lập dự toán (Điều chỉnh)",
                    })}
                    error={errors.giai_doan?.[6]?.ma_don_vi?.message}
                  ></SelectField>

                  <MultiFileControl
                    control={control}
                    // name phải khớp với index của giai đoạn (ví dụ giai đoạn Dự toán thường là index 0)
                    name="giai_doan.6.file_links"
                    label="Danh sách tài liệu đính kèm"
                  />
                </div>
              </div>
            )}
            {/* <div className="border-t border-dashed border-slate-300" /> */}
          </div>
        </div>
      )}
    </div>
  );
}
