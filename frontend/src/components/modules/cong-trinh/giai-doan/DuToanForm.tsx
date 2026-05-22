"use client";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { useFormContext } from "react-hook-form";
import { GiaiDoanDto, ProjectFormData } from "../ProjectFormData";
import { useCongTrinh } from "@/context/CongTrinhContext";
import { formatCurrency } from "@/utils/formatnumber";
import { MA_HIEU_MAPPING } from "../GiaiDoan";
import { MultiFileControl } from "@/components/ui/MultiFile";
import { useStageLock } from "@/hooks/useStageLock";
// ĐỊNH NGHĨA DANH SÁCH Ở ĐÂY CHO DỄ TÌM
const OPTIONS_DU_TOAN = [
  { value: "KTC", label: "Cty CP Tư vấn Xây dựng giao thông KTC" },
  { value: "SR", label: "Cty TNHH Thiết kế Soài Rạp" },
];

const OPTIONS_THAM_TRA = [
  { value: "TNB", label: "Cty TNHH Tư vấn Xây dựng Tây Nam Bộ" },
  { value: "TP", label: "Cty TNHH TV Thiết kế Xây dựng Trường Phú" },
  { value: "IQ", label: "Công Ty TNHH Tư vấn Giao thông IQ" },
];

interface Props {
  stage: GiaiDoanDto[];
}

export function DuToanForm({ stage }: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();

  // 🌟 GỌI HOOK CHO NHÁNH 1: DỰ TOÁN (Khai báo đúng Index trong mảng là 1)
  const duToan = useStageLock({ targetIndex: 0 });

  // 🌟 GỌI HOOK CHO NHÁNH 2: THẨM TRA DỰ TOÁN (Khai báo đúng Index trong mảng là 2)
  const thamTra = useStageLock({ targetIndex: 1 });

  return (
    <div>
      {duToan.showUnlockButton && (
        <button
          type="button"
          className="w-full py-3 my-2 border-2 border-dashed border-slate-200 text-slate-400 font-medium text-sm rounded-xl flex items-center justify-center gap-2 bg-white transition-all duration-200 
             enabled:border-indigo-300 enabled:text-indigo-600 enabled:hover:bg-indigo-50/50 enabled:hover:border-indigo-500 enabled:hover:shadow-sm
             disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          onClick={duToan.unlockStage}
        >
          <span className="text-lg font-light">+</span> Mở khoá giai đoạn tiếp
          theo
        </button>
      )}
      <div
        className={`${duToan.isDisabled ? "bg-gray-100 " : "bg-white "} border border-slate-200 rounded-xl shadow-sm overflow-hidden`}
      >
        {/* Tiêu đề khối */}
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
          <h3 className="font-bold text-sm uppercase text-blue-800">
            II. Dự toán & Thẩm tra:{" "}
            <span className="hidden">{data?.ten_cong_trinh}</span>
          </h3>
          <span className="text-[10px] text-gray-400 italic font-medium">
            Đơn vị: VNĐ
          </span>
        </div>

        <div className="p-5 space-y-8">
          {/* Nhánh Dự toán */}
          <div>
            <div
              className={`overflow-hidden transition-all duration-300
                  ${
                    duToan.isDisabled
                      ? "bg-slate-50/80 opacity-50 pointer-events-none select-none grayscale-30 p-4"
                      : "bg-white opacity-100"
                  }`}
            >
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
                      required: !duToan.isDisabled
                        ? "Vui lòng nhập ngày lập dự toán"
                        : false,
                    })}
                    disabled={duToan.isDisabled}
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
                      required: !duToan.isDisabled
                        ? "Vui lòng nhập tổng giá trị dự toán"
                        : false,
                    })}
                    disabled={duToan.isDisabled}
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
                      required: !duToan.isDisabled
                        ? "Vui lòng nhập tổng chi phí xây dựng"
                        : false,
                    })}
                    disabled={duToan.isDisabled}
                    error={errors.giai_doan?.[0]?.chi_phi_xay_dung?.message}
                  />
                  <SelectField
                    label="Đơn vị"
                    options={OPTIONS_DU_TOAN}
                    {...register(`giai_doan.0.ma_don_vi`, {
                      required: !duToan.isDisabled
                        ? "Vui lòng nhập đơn vị lập dự toán"
                        : false,
                    })}
                    disabled={duToan.isDisabled}
                    error={errors.giai_doan?.[0]?.ma_don_vi?.message}
                  ></SelectField>
                  {!duToan.isDisabled && (
                    <MultiFileControl
                      control={control}
                      // name phải khớp với index của giai đoạn (ví dụ giai đoạn Dự toán thường là index 0)
                      name="giai_doan.0.file_links"
                      label="Danh sách tài liệu đính kèm"
                    />
                  )}
                </>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300" />

          {/* Nhánh Thẩm tra */}

          {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[0].ma_hieu) && (
            <div className="space-y-4">
              {thamTra.showUnlockButton && (
                <button
                  type="button"
                  className="w-full py-3 my-4 border-2 border-dashed border-slate-200 text-slate-400 font-medium text-sm rounded-xl flex items-center justify-center gap-2 bg-white transition-all duration-200 
             enabled:border-indigo-300 enabled:text-indigo-600 enabled:hover:bg-indigo-50/50 enabled:hover:border-indigo-500 enabled:hover:shadow-sm
             disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  onClick={thamTra.unlockStage}
                >
                  <span className="text-lg font-light">+</span> Mở khoá giai
                  đoạn tiếp theo
                </button>
              )}
              <div
                className={`overflow-hidden transition-all duration-300
                  ${
                    thamTra.isDisabled
                      ? "bg-slate-50/80 opacity-50 pointer-events-none select-none grayscale-30 p-4"
                      : "bg-white opacity-100"
                  }`}
              >
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
                      required: !thamTra.isDisabled
                        ? "Vui lòng nhập ngày thẩm tra dự toán"
                        : false,
                    })}
                    disabled={thamTra.isDisabled}
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
                      required: !thamTra.isDisabled
                        ? "Vui lòng nhập Tổng giá trị sau thẩm tra"
                        : false,
                    })}
                    disabled={thamTra.isDisabled}
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
                      required: !thamTra.isDisabled
                        ? "Vui lòng nhập Tổng chi phí Xây dựng"
                        : false,
                    })}
                    disabled={thamTra.isDisabled}
                  />
                  <SelectField
                    label="Đơn vị"
                    options={OPTIONS_THAM_TRA}
                    {...register(`giai_doan.1.ma_don_vi`, {
                      required: !thamTra.isDisabled
                        ? "Vui lòng chọn Đơn vị"
                        : false,
                    })}
                    disabled={thamTra.isDisabled}
                  ></SelectField>
                  {!thamTra.isDisabled && (
                    <MultiFileControl
                      control={control}
                      // name phải khớp với index của giai đoạn (ví dụ giai đoạn Dự toán thường là index 0)
                      name="giai_doan.1.file_links"
                      label="Danh sách tài liệu đính kèm"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
