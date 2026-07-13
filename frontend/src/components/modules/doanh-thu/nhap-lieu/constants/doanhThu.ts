import dayjs from "dayjs";

export const BEN_MAC_DINH = "AH"; // Bến An Hòa làm chuẩn so sánh giá
export const NGAY_MAC_DINH = dayjs("2026-07-01");
export const THUE_SUAT_MAC_DINH = {
  HANH_KHACH: 8,
  XE_CAC_LOAI: 8,
  THUE_BAO: 8,
  VE_THEO_LUOT: 8,
  VE_THANG: 8,
  VE_QUI: 8,
  VE_NAM: 8,
} as const;

export const NGAY_CHUYEN_DOI_LOAI_DU_LIEU = 20; // Ngày 20 hàng tháng đối với dữ liệu lịch sử lịch trước START_DATE
