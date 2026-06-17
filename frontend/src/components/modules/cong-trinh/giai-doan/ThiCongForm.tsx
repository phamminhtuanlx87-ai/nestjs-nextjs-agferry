"use client";
import React, { useEffect } from "react";
import { GiaiDoanDto, ProjectFormData } from "../ProjectFormData";
import { useFormContext } from "react-hook-form";
import { useCongTrinh } from "@/context/CongTrinhContext";
import { MA_HIEU_MAPPING } from "../GiaiDoan";
import Input from "@/components/ui/Input";
import { SelectField } from "@/components/ui/SelectField";
import { useStageLock } from "@/hooks/useStageLock";

interface Props {
  stage: GiaiDoanDto[];
}
// ĐỊNH NGHĨA DANH SÁCH Ở ĐÂY CHO DỄ TÌM
const OPTIONS_DU_TOAN = [{ value: "XNCK", label: "XN Cơ khí Giao thông" }];
const OPTIONS_GIAM_SAT = [
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

  // 🌟 GỌI HOOK CHO NHÁNH 3: Thi công
  const thiccong = useStageLock({ targetIndex: 3 });

  // 🌟 GỌI HOOK CHO NHÁNH 4: Nghiệm thu
  const nghiemthu = useStageLock({ targetIndex: 4 });

  return (
    <div>
      {/* Tiêu đề khối */}
      {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[2].ma_hieu) && (
        <>
          {thiccong.showUnlockButton && (
            <button
              type="button"
              className="w-full py-3 my-2 border-2 border-dashed border-slate-200 text-slate-400 font-medium text-sm rounded-xl flex items-center justify-center gap-2 bg-white transition-all duration-200 
             enabled:border-indigo-300 enabled:text-indigo-600 enabled:hover:bg-indigo-50/50 enabled:hover:border-indigo-500 enabled:hover:shadow-sm
             disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              onClick={thiccong.unlockStage}
            >
              <span className="text-lg font-light">+</span> Mở khoá giai đoạn
              tiếp theo
            </button>
          )}
          <div>
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between">
              <h3 className="font-bold text-sm uppercase text-blue-800">
                IV. Thi công & Nghiệm thu{" "}
                <span className="hidden">{data?.ten_cong_trinh}</span>
              </h3>
              <span className="text-[10px] text-gray-400 italic font-medium"></span>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300
                  ${
                    thiccong.isDisabled
                      ? "bg-slate-50/80 opacity-50 pointer-events-none select-none grayscale-30 p-4"
                      : "bg-white opacity-100"
                  }`}
            >
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
                      required: !thiccong.isDisabled
                        ? "Vui lòng nhập Ngày khởi công"
                        : false,
                    })}
                    disabled={thiccong.isDisabled}
                    error={errors.giai_doan?.[3]?.ngay_thuc_hien?.message}
                  />

                  <Input
                    label="Số ngày thi công (theo PGV)"
                    type="text"
                    {...register(`giai_doan.3.so_ngay_tc_pgv`, {
                      required: !thiccong.isDisabled
                        ? "Vui lòng nhập Số ngày thi công (theo PGV)"
                        : false,
                    })}
                    disabled={thiccong.isDisabled}
                    error={errors.giai_doan?.[3]?.so_ngay_tc_pgv?.message}
                  />

                  <Input
                    label="Ngày Hoàn thành (theo PGV)"
                    type="date"
                    readOnly
                    // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                    className="bg-gray-100 cursor-not-allowed opacity-70"
                    {...register(`giai_doan.3.ngay_hoan_thanh`, {
                      required: !thiccong.isDisabled
                        ? "Vui lòng nhập Ngày Hoàn thành (theo PGV)"
                        : false,
                    })}
                    disabled={thiccong.isDisabled}
                    error={errors.giai_doan?.[3]?.ngay_hoan_thanh?.message}
                  />

                  <div className="col-span-1 md:col-span-3">
                    <SelectField
                      label="Đơn vị Thi công"
                      defaultValue={OPTIONS_DU_TOAN[0].value}
                      options={OPTIONS_DU_TOAN}
                      {...register(`giai_doan.3.ma_don_vi`, {
                        required: !thiccong.isDisabled
                          ? "Vui lòng nhập Đơn vị Thi công"
                          : false,
                      })}
                      disabled={thiccong.isDisabled}
                      error={errors.giai_doan?.[3]?.ma_don_vi?.message}
                    ></SelectField>
                  </div>

                  <Input
                    label="Địa điểm thi công"
                    type="text"
                    {...register(`giai_doan.3.dia_diem_tc`, {
                      required: !thiccong.isDisabled
                        ? "Vui lòng nhập Địa điểm thi công"
                        : false,
                    })}
                    defaultValue={
                      "Số 818/A, Ấp An Thuận, Xã Hội An, Tỉnh An Giang"
                    }
                    disabled={thiccong.isDisabled}
                    error={errors.giai_doan?.[3]?.dia_diem_tc?.message}
                  />
                  <div className="col-span-1 md:col-span-3">
                    <SelectField
                      label="Đơn vị Giám sát"
                      options={OPTIONS_GIAM_SAT}
                      {...register(
                        `giai_doan.3.thong_tin_them.don_vi_giam_sat`,
                        {
                          required: !thiccong.isDisabled
                            ? "Vui lòng nhập Đơn vị"
                            : false,
                        },
                      )}
                      disabled={thiccong.isDisabled}
                      error={
                        errors.giai_doan?.[3]?.thong_tin_them?.don_vi_giam_sat
                          ?.message
                      }
                    ></SelectField>
                  </div>
                </div>
                <div className="border-t border-dashed border-slate-200 px-8" />
              </div>
            </div>
            {stage.find((gd) => gd.ma_hieu === MA_HIEU_MAPPING[3].ma_hieu) && (
              <>
                {nghiemthu.showUnlockButton && (
                  <button
                    type="button"
                    className="w-full py-3 my-2 border-2 border-dashed border-slate-200 text-slate-400 font-medium text-sm rounded-xl flex items-center justify-center gap-2 bg-white transition-all duration-200 
             enabled:border-indigo-300 enabled:text-indigo-600 enabled:hover:bg-indigo-50/50 enabled:hover:border-indigo-500 enabled:hover:shadow-sm
             disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    onClick={nghiemthu.unlockStage}
                  >
                    <span className="text-lg font-light">+</span> Mở khoá giai
                    đoạn tiếp theo
                  </button>
                )}
                {/* Nhánh Nghiệm thu */}
                <div
                  className={`overflow-hidden transition-all duration-300
                  ${
                    nghiemthu.isDisabled
                      ? "bg-slate-50/80 opacity-50 pointer-events-none select-none grayscale-30 p-4"
                      : "bg-white opacity-100"
                  }`}
                >
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
                          required: !nghiemthu.isDisabled
                            ? "Vui lòng nhập Ngày nghiệm thu"
                            : false,
                        })}
                        disabled={nghiemthu.isDisabled}
                        error={errors.giai_doan?.[4]?.ngay_thuc_hien?.message}
                      />

                      <Input
                        label="Số ngày thi công thực tế"
                        type="text"
                        readOnly
                        // Thêm class để hiển thị giao diện giống như bị khóa (màu xám, chuột hình cấm)
                        className="bg-gray-100 cursor-not-allowed opacity-70"
                        {...register(`giai_doan.4.so_ngay_tc_thuc_te`, {
                          required: !nghiemthu.isDisabled
                            ? "Vui lòng nhập Số ngày thi công thực tế"
                            : false,
                        })}
                        error={
                          errors.giai_doan?.[4]?.so_ngay_tc_thuc_te?.message
                        }
                      />

                      {/* <SelectField
                        label="Đơn vị Giám sát"
                        options={OPTIONS_GIAM_SAT}
                        {...register(`giai_doan.4.ma_don_vi`, {
                          required: !nghiemthu.isDisabled
                            ? "Vui lòng nhập Đơn vị"
                            : false,
                        })}
                        disabled={nghiemthu.isDisabled}
                        error={errors.giai_doan?.[4]?.ma_don_vi?.message}
                      ></SelectField> */}
                    </div>
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
