import { MAPPING_CHUNG_LOAI_FIELD } from '../constants/mapping_ben_pha';
import { DuLieuTyTrongDto } from '../dto/chart-ty-trong-doanh-thu-response.dto';

export function tinhTyTrongChoNhom(
  danhSachNhom: DuLieuTyTrongDto[],
): DuLieuTyTrongDto[] {
  const tongSanLuong = danhSachNhom.reduce(
    (tong, item) => tong + (item.san_luong || 0),
    0,
  );

  const tongDoanhThu = danhSachNhom.reduce(
    (tong, item) => tong + (item.doanh_thu || 0),
    0,
  );
  return danhSachNhom.map((item) => ({
    nhom: item.nhom,
    nhan: MAPPING_CHUNG_LOAI_FIELD[
      item.nhom as keyof typeof MAPPING_CHUNG_LOAI_FIELD
    ],
    san_luong: item.san_luong || 0,
    doanh_thu: item.doanh_thu || 0,
    ty_trong_san_luong:
      tongSanLuong > 0
        ? Math.round(((item.san_luong || 0) / tongSanLuong) * 1000) / 10
        : 0,
    ty_trong_doanh_thu:
      tongDoanhThu > 0
        ? Math.round(((item.doanh_thu || 0) / tongDoanhThu) * 1000) / 10
        : 0,
  }));
}
