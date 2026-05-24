interface GiaiDoanInfo {
  ma_hieu: string;
  ten_giai_doan: string;
}

export const MA_HIEU_MAPPING: Record<number, GiaiDoanInfo> = {
  0: { ma_hieu: "DT", ten_giai_doan: "Dự toán" },
  1: { ma_hieu: "TTR_DT", ten_giai_doan: "Thẩm tra dự toán" },
  2: { ma_hieu: "PD_DT", ten_giai_doan: "Phê duyệt dự toán" },
  3: { ma_hieu: "TC", ten_giai_doan: "Thi công & Nghiệm thu" },
  4: { ma_hieu: "NT", ten_giai_doan: "Nghiệm thu" },
  5: { ma_hieu: "DT_PS", ten_giai_doan: "Dự toán bổ sung (PS)" },
  6: { ma_hieu: "TTR_DT_PS", ten_giai_doan: "Thẩm tra dự toán bổ sung" },
  7: { ma_hieu: "PD_DT_PS", ten_giai_doan: "Phê duyệt dự toán bổ sung" },
  8: { ma_hieu: "QT", ten_giai_doan: "Quyết toán" },
};
