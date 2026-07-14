export interface DuLieuComboChartDto {
  ngay?: string;
  nhan: string;
  nhom_con?: string;
  san_luong: number;
  doanh_thu: number;
}

export interface ChartSanLuongDoanhThuResponseDto {
  don_vi_san_luong: 'lượt';
  don_vi_doanh_thu: 'đ';
  loai_nhom: string;
  tu_ngay: string;
  den_ngay: string;
  du_lieu: DuLieuComboChartDto[];
}
