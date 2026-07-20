// dto/chart-ty-trong-doanh-thu-response.dto.ts

export interface ChartResponseChungDto {
  don_vi_san_luong: string;
  don_vi_doanh_thu: string;
  tu_ngay: string;
  den_ngay: string;
}

export interface DuLieuTyTrongDto {
  ma_ben?: string;
  ten_ben?: string;
  san_luong?: number;
  doanh_thu?: number;
  ty_trong_san_luong?: number;
  ty_trong_doanh_thu?: number;
  nhom?: string;
}

export interface ChartTyTrongResponseDto extends ChartResponseChungDto {
  ve_luot: DuLieuTyTrongDto[];
  ve_ky: DuLieuTyTrongDto[];
}

export const NHOM_VE_LUOT = [
  'HANH_KHACH',
  'THUE_BAO',
  'XE_KHACH',
  'XE_TAI',
] as const;

export const NHOM_VE_KY = ['VE_THANG', 'VE_QUI', 'VE_NAM'] as const;
