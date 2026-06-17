"use client";
import React, { useEffect } from "react";
import { GiaiDoanDto, ProjectFormData } from "../ProjectFormData";
import Input from "@/components/ui/Input";
import { useFormContext } from "react-hook-form";
import { useCongTrinh } from "@/context/CongTrinhContext";
import { SelectField } from "@/components/ui/SelectField";
import { MA_HIEU_MAPPING } from "../GiaiDoan";
import { formatCurrency } from "@/utils/formatnumber";
import { MultiFileControl } from "@/components/ui/MultiFile";
import { useStageLock } from "@/hooks/useStageLock";

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
  { value: "IQ", label: "Công Ty TNHH Tư vấn Giao thông IQ" },
];

const parseVietnameseNumber = (
  value: string | number | undefined | null,
): number => {
  if (value === undefined || value === null) return 0;
  // Chuyển về chuỗi, xóa sạch các dấu chấm phân cách hàng nghìn, rồi mới ép thành Number
  const cleanString = value.toString().replace(/\./g, "");
  const parsed = Number(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

const calculateSum = (
  baseVal: string | number | undefined | null,
  plusVal: string | number | undefined | null,
  minusVal: string | number | undefined | null,
  extraVal: string | number | undefined | null,
): number => {
  return (
    parseVietnameseNumber(baseVal) +
    parseVietnameseNumber(plusVal) -
    parseVietnameseNumber(minusVal) +
    parseVietnameseNumber(extraVal)
  );
};

export default function DuToanPSForm({ stage }: Props) {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProjectFormData>();
  const data = useCongTrinh();
  // 🌟 GỌI HOOK CHO NHÁNH 5: Dự toán phát sinh
  const dtps = useStageLock({ targetIndex: 5 });
  // 🌟 GỌI HOOK CHO NHÁNH 6: Thẩm tra Dự toán phát sinh
  const ttrdtps = useStageLock({ targetIndex: 6 });

  const tong_gia_tri = watch("giai_doan.2.tong_gia_tri");
  const chi_phi_xay_dung = watch("giai_doan.2.chi_phi_xay_dung");

  const ps_tang = watch("giai_doan.5.thong_tin_them.ps_tang");
  const ps_giam = watch("giai_doan.5.thong_tin_them.ps_giam");
  const cp_tham_tra_ps = watch("giai_doan.5.thong_tin_them.cp_tham_tra_ps");

  const ps_tang_tham_tra = watch("giai_doan.6.thong_tin_them.ps_tang");
  const ps_giam_tham_tra = watch("giai_doan.6.thong_tin_them.ps_giam");
  const cp_tham_tra_ps_tham_tra = watch(
    "giai_doan.6.thong_tin_them.cp_tham_tra_ps",
  );

  useEffect(() => {
    if (tong_gia_tri || ps_tang || ps_giam || cp_tham_tra_ps) {
      // 2. Tính toán giá trị điều chỉnh (Không cần ép kiểu 'as string' rườm rà)
      const chi_phi_xay_dung_dc = calculateSum(
        chi_phi_xay_dung,
        ps_tang,
        ps_giam,
        0,
      );
      const tong_gia_tri_dc = calculateSum(
        tong_gia_tri,
        ps_tang,
        ps_giam,
        cp_tham_tra_ps,
      );

      // 3. Format chuỗi tiền tệ vi-VN
      const formattedTGT = tong_gia_tri_dc.toLocaleString("vi-VN");
      const formattedCPXD = chi_phi_xay_dung_dc.toLocaleString("vi-VN");

      // 4. BẬT CHỐT CHẶN: Chỉ cập nhật form khi giá trị tính toán thực sự KHÁC với giá trị hiện tại trên Form
      // Điều này dập tắt hoàn toàn lỗi vòng lặp vô hạn (Infinite Loop)!
      if (tong_gia_tri !== formattedTGT) {
        setValue("giai_doan.5.tong_gia_tri", formattedTGT);
      }
      if (chi_phi_xay_dung !== formattedCPXD) {
        setValue("giai_doan.5.chi_phi_xay_dung", formattedCPXD);
      }
    }
  }, [
    tong_gia_tri,
    chi_phi_xay_dung,
    ps_tang,
    ps_giam,
    cp_tham_tra_ps,
    setValue,
  ]);

  useEffect(() => {
    if (
      tong_gia_tri ||
      ps_tang_tham_tra ||
      ps_giam_tham_tra ||
      cp_tham_tra_ps_tham_tra
    ) {
      const chi_phi_xay_dung_dc = calculateSum(
        chi_phi_xay_dung,
        ps_tang_tham_tra,
        ps_giam_tham_tra,
        0,
      );

      const tong_gia_tri_dc = calculateSum(
        tong_gia_tri,
        ps_tang_tham_tra,
        ps_giam_tham_tra,
        cp_tham_tra_ps_tham_tra,
      );

      // 3. Format chuỗi tiền tệ vi-VN
      const formattedTGT = tong_gia_tri_dc.toLocaleString("vi-VN");
      const formattedCPXD = chi_phi_xay_dung_dc.toLocaleString("vi-VN");

      // 4. BẬT CHỐT CHẶN: Chỉ cập nhật form khi giá trị tính toán thực sự KHÁC với giá trị hiện tại trên Form
      // Điều này dập tắt hoàn toàn lỗi vòng lặp vô hạn (Infinite Loop)!
      if (tong_gia_tri !== formattedTGT) {
        setValue("giai_doan.6.tong_gia_tri", formattedTGT);
      }
      if (chi_phi_xay_dung !== formattedCPXD) {
        setValue("giai_doan.6.chi_phi_xay_dung", formattedCPXD);
      }
    }
  }, [
    tong_gia_tri,
    chi_phi_xay_dung,
    ps_tang_tham_tra,
    ps_giam_tham_tra,
    cp_tham_tra_ps_tham_tra,
    setValue,
  ]);
  return (
    <div>
      {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[4].ma_hieu) && (
        <div>
          {dtps.showUnlockButton && (
            <button
              type="button"
              className="w-full py-3 my-2 border-2 border-dashed border-slate-200 text-slate-400 font-medium text-sm rounded-xl flex items-center justify-center gap-2 bg-white transition-all duration-200 
             enabled:border-indigo-300 enabled:text-indigo-600 enabled:hover:bg-indigo-50/50 enabled:hover:border-indigo-500 enabled:hover:shadow-sm
             disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              onClick={dtps.unlockStage}
            >
              <span className="text-lg font-light">+</span> Mở khoá giai đoạn
              tiếp theo
            </button>
          )}

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
              <div
                className={`overflow-hidden transition-all duration-300
                  ${
                    dtps.isDisabled
                      ? "bg-slate-50/80 opacity-50 pointer-events-none select-none grayscale-30 p-4"
                      : "bg-white opacity-100"
                  }`}
              >
                <div className="flex items-center mb-4 text-amber-900">
                  <span className="bg-amber-900 w-1 h-4 mr-2 rounded-full"></span>
                  <span className="text-sm font-bold uppercase">
                    Dự toán (Điều chỉnh)
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Input
                    label="Ngày lập dự toán (Điều chỉnh)"
                    type="date"
                    {...register(`giai_doan.5.ngay_thuc_hien`, {
                      required: !dtps.isDisabled
                        ? "Vui lòng nhập Ngày lập dự toán (Điều chỉnh)"
                        : false,
                    })}
                    disabled={dtps.isDisabled}
                    error={errors.giai_doan?.[5]?.ngay_thuc_hien?.message}
                  />

                  <Input
                    label="Tổng giá trị dự toán (Điều chỉnh)"
                    type="text"
                    readOnly
                    // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                    className="bg-gray-100 cursor-not-allowed opacity-70"
                    {...register(`giai_doan.5.tong_gia_tri`, {
                      onChange: (e) => {
                        const formatted = formatCurrency(e.target.value);
                        e.target.value = formatted;
                      },
                      required: !dtps.isDisabled
                        ? "Vui lòng nhập Tổng giá trị dự toán (Điều chỉnh)"
                        : false,
                    })}
                    disabled={dtps.isDisabled}
                    error={errors.giai_doan?.[5]?.tong_gia_tri?.message}
                  />

                  <Input
                    label="Tổng chi phí xây dựng (Điều chỉnh)"
                    type="text"
                    readOnly
                    // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                    className="bg-gray-100 cursor-not-allowed opacity-70 "
                    {...register(`giai_doan.5.chi_phi_xay_dung`, {
                      onChange: (e) => {
                        const formatted = formatCurrency(e.target.value);
                        e.target.value = formatted;
                      },
                      required: !dtps.isDisabled
                        ? "Vui lòng nhập Tổng chi phí xây dựng (Điều chỉnh)"
                        : false,
                    })}
                    disabled={dtps.isDisabled}
                    error={errors.giai_doan?.[5]?.chi_phi_xay_dung?.message}
                  />

                  <Input
                    label="Phát sinh tăng"
                    type="text"
                    placeholder="0"
                    {...register(`giai_doan.5.thong_tin_them.ps_tang`, {
                      onChange: (e) => {
                        const formatted = formatCurrency(e.target.value);
                        e.target.value = formatted;
                      },
                      required: !dtps.isDisabled
                        ? "Vui lòng nhập Phát sinh tăng"
                        : false,
                    })}
                    disabled={dtps.isDisabled}
                    error={
                      errors.giai_doan?.[5]?.thong_tin_them?.ps_tang?.message
                    }
                  />

                  <Input
                    label="Phát sinh giảm"
                    type="text"
                    placeholder="0"
                    {...register(`giai_doan.5.thong_tin_them.ps_giam`, {
                      onChange: (e) => {
                        const formatted = formatCurrency(e.target.value);
                        e.target.value = formatted;
                      },
                      required: !dtps.isDisabled
                        ? "Vui lòng nhập Phát sinh giảm"
                        : false,
                    })}
                    disabled={dtps.isDisabled}
                    error={
                      errors.giai_doan?.[5]?.thong_tin_them?.ps_giam?.message
                    }
                  />

                  <Input
                    label="Chi phí thẩm tra Dự toán phát sinh"
                    type="text"
                    placeholder="0"
                    {...register(`giai_doan.5.thong_tin_them.cp_tham_tra_ps`, {
                      onChange: (e) => {
                        const formatted = formatCurrency(e.target.value);
                        e.target.value = formatted;
                      },
                      required: !dtps.isDisabled
                        ? "Vui lòng nhập Chi phí thẩm tra"
                        : false,
                    })}
                    disabled={dtps.isDisabled}
                    error={
                      errors.giai_doan?.[5]?.thong_tin_them?.cp_tham_tra_ps
                        ?.message
                    }
                  />
                  <div className="col-span-1 md:col-span-3">
                    <SelectField
                      label="Đơn vị lập Dự toán (Điều chỉnh)"
                      options={OPTIONS_DU_TOAN}
                      {...register(`giai_doan.5.ma_don_vi`, {
                        required: !dtps.isDisabled
                          ? "Vui lòng nhập Đơn vị lập Dự toán (Điều chỉnh)"
                          : false,
                      })}
                      disabled={dtps.isDisabled}
                      error={errors.giai_doan?.[5]?.ma_don_vi?.message}
                    ></SelectField>
                  </div>

                  {!dtps.isDisabled && (
                    <div className="col-span-1 md:col-span-3">
                      <MultiFileControl
                        control={control}
                        // name phải khớp với index của giai đoạn (ví dụ giai đoạn Dự toán thường là index 0)
                        name="giai_doan.5.file_links"
                        label="Danh sách tài liệu đính kèm"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300" />

              {/* Nhánh Thẩm tra */}
              {stage.find(
                (gd) => gd.ma_hieu === MA_HIEU_MAPPING[5].ma_hieu,
              ) && (
                <div>
                  {ttrdtps.showUnlockButton && (
                    <button
                      type="button"
                      className="w-full py-3 my-2 border-2 border-dashed border-slate-200 text-slate-400 font-medium text-sm rounded-xl flex items-center justify-center gap-2 bg-white transition-all duration-200 
             enabled:border-indigo-300 enabled:text-indigo-600 enabled:hover:bg-indigo-50/50 enabled:hover:border-indigo-500 enabled:hover:shadow-sm
             disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      onClick={ttrdtps.unlockStage}
                    >
                      <span className="text-lg font-light">+</span> Mở khoá giai
                      đoạn tiếp theo
                    </button>
                  )}
                  <div
                    className={`overflow-hidden transition-all duration-300
                  ${
                    ttrdtps.isDisabled
                      ? "bg-slate-50/80 opacity-50 pointer-events-none select-none grayscale-30 p-4"
                      : "bg-white opacity-100"
                  }`}
                  >
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
                          required: !ttrdtps.isDisabled
                            ? "Vui lòng nhập Ngày thẩm tra Dự toán (Điều chỉnh)"
                            : false,
                        })}
                        disabled={ttrdtps.isDisabled}
                        error={errors.giai_doan?.[6]?.ngay_thuc_hien?.message}
                      />

                      <Input
                        label="Tổng giá trị dự toán (Điều chỉnh) sau thẩm tra"
                        type="text"
                        readOnly
                        // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                        className="bg-gray-100 cursor-not-allowed opacity-70"
                        {...register(`giai_doan.6.tong_gia_tri`, {
                          onChange: (e) => {
                            const formatted = formatCurrency(e.target.value);
                            e.target.value = formatted;
                          },
                          required: !ttrdtps.isDisabled
                            ? "Vui lòng nhập Tổng giá trị dự toán (Điều chỉnh) sau thẩm tra"
                            : false,
                        })}
                        disabled={ttrdtps.isDisabled}
                        error={errors.giai_doan?.[6]?.tong_gia_tri?.message}
                      />

                      <Input
                        label="Tổng chi phí xây dựng (Điều chỉnh)"
                        type="text"
                        readOnly
                        // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                        className="bg-gray-100 cursor-not-allowed opacity-70"
                        {...register(`giai_doan.6.chi_phi_xay_dung`, {
                          onChange: (e) => {
                            const formatted = formatCurrency(e.target.value);
                            e.target.value = formatted;
                          },
                          required: !ttrdtps.isDisabled
                            ? "Vui lòng nhập Tổng chi phí xây dựng (Điều chỉnh)"
                            : false,
                        })}
                        disabled={ttrdtps.isDisabled}
                        error={errors.giai_doan?.[6]?.chi_phi_xay_dung?.message}
                      />

                      <Input
                        label="Phát sinh tăng"
                        type="text"
                        placeholder="0"
                        {...register(`giai_doan.6.thong_tin_them.ps_tang`, {
                          onChange: (e) => {
                            const formatted = formatCurrency(e.target.value);
                            e.target.value = formatted;
                          },
                          required: !dtps.isDisabled
                            ? "Vui lòng nhập Phát sinh tăng"
                            : false,
                        })}
                        disabled={dtps.isDisabled}
                        error={
                          errors.giai_doan?.[6]?.thong_tin_them?.ps_tang
                            ?.message
                        }
                      />

                      <Input
                        label="Phát sinh giảm"
                        type="text"
                        placeholder="0"
                        {...register(`giai_doan.6.thong_tin_them.ps_giam`, {
                          onChange: (e) => {
                            const formatted = formatCurrency(e.target.value);
                            e.target.value = formatted;
                          },
                          required: !dtps.isDisabled
                            ? "Vui lòng nhập Phát sinh giảm"
                            : false,
                        })}
                        disabled={dtps.isDisabled}
                        error={
                          errors.giai_doan?.[6]?.thong_tin_them?.ps_giam
                            ?.message
                        }
                      />

                      <Input
                        label="Chi phí thẩm tra Dự toán phát sinh"
                        type="text"
                        placeholder="0"
                        {...register(
                          `giai_doan.6.thong_tin_them.cp_tham_tra_ps`,
                          {
                            onChange: (e) => {
                              const formatted = formatCurrency(e.target.value);
                              e.target.value = formatted;
                            },
                            required: !dtps.isDisabled
                              ? "Vui lòng nhập Chi phí thẩm tra"
                              : false,
                          },
                        )}
                        disabled={dtps.isDisabled}
                        error={
                          errors.giai_doan?.[6]?.thong_tin_them?.cp_tham_tra_ps
                            ?.message
                        }
                      />

                      <div className="col-span-1 md:col-span-3">
                        <SelectField
                          label="Đơn vị lập Dự toán (Điều chỉnh)"
                          options={OPTIONS_THAM_TRA}
                          {...register(`giai_doan.6.ma_don_vi`, {
                            required: !ttrdtps.isDisabled
                              ? "Vui lòng nhập Đơn vị lập Dự toán (Điều chỉnh)"
                              : false,
                          })}
                          disabled={ttrdtps.isDisabled}
                          error={errors.giai_doan?.[6]?.ma_don_vi?.message}
                        ></SelectField>
                      </div>

                      {!ttrdtps.isDisabled && (
                        <div className="col-span-1 md:col-span-3">
                        <MultiFileControl
                          control={control}
                          // name phải khớp với index của giai đoạn (ví dụ giai đoạn Dự toán thường là index 0)
                          name="giai_doan.6.file_links"
                          label="Danh sách tài liệu đính kèm"
                        />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="border-t border-dashed border-slate-300" /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
