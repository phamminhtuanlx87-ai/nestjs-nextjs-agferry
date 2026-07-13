// 1. Định nghĩa bảng Mapping Mã bến -> Tên bến đầy đủ (Không dùng any)
export const MAP_TEN_BEN: Record<string, string> = {
  AH: 'Bến phà An Hòa',
  OM: 'Bến phà Ô Môi',
  TO: 'Bến phà Trà Ôn',
  VC: 'Bến phà Vàm Cống',
  MR: `Bến phà Mương Ranh`,
  NG: 'Bến phà Năng Gù', // Ví dụ các bến khác nếu có
  TG: 'Bến phà Thuận Giang',
  TC: 'Bến phà Tân Châu6u',
} as const;

export enum KieuHienThiChart {
  THEO_BEN_PHA = 'THEO_BEN_PHA', // Dùng cho Hôm nay, Hôm qua (Bar Chart)
  THEO_THOI_GIAN = 'THEO_THOI_GIAN', // Dùng cho các khoảng thời gian còn lại (Column + Line)
}

export interface CauHinhFilterChart {
  ngayBatDau: Date;
  ngayKetThuc: Date;
  kieuChart: KieuHienThiChart;
  groupBy: string;
}

export enum LoaiThoiGianBieuDo {
  HOM_NAY = 'HOM_NAY',
  BAY_NGAY_GAN_NHAT = 'BAY_NGAY_GAN_NHAT',
  BA_MUOI_NGAY_GAN_NHAT = 'BA_MUOI_NGAY_GAN_NHAT',
  THANG_NAY = 'THANG_NAY',
  QUI_NAY = 'QUI_NAY',
  NAM_NAY = 'NAM_NAY',
  TUY_CHON = 'TUY_CHON',
}

export const MAPPING_CHUNG_LOAI_FIELD: Record<string, string> = {
  HANH_KHACH: 'Hành Khách',
  XE_KHACH: 'Xe Khách',
  XE_TAI: 'Xe tải',
  THUE_BAO: 'Thuê bao',
  VE_THANG: 'Vé tháng',
  VE_QUI: 'Vé quí',
  VE_NAM: 'Vé năm',
} as const;
