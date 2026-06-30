import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ChiTietSanLuongDto {
  @IsString({ message: 'Mã loại vé phải là chuỗi chữ' })
  @IsNotEmpty({ message: 'Không được để trống mã loại vé' })
  ma_loai_ve!: string;

  @IsNumber({}, { message: 'Sản lượng xe qua phà phải là số' })
  @Min(0, { message: 'Sản lượng không được là số âm' })
  @IsNotEmpty({ message: 'Không được để trống sản lượng' })
  so_luot_xe!: number;

  // 🌟 ĐÃ SỬA: Thêm @IsOptional() vì Backend sẽ tự động điền đơn giá từ danhmucgiave
  @IsOptional()
  @IsNumber()
  @Min(0)
  gia_ve_ap_dung?: number;

  // 🌟 ĐÃ SỬA: Thêm @IsOptional() vì Backend sẽ tự động tính (so_luot_xe * gia_ve_ap_dung)
  @IsOptional()
  @IsNumber()
  @Min(0)
  tong_doanh_thu?: number;

  @IsString({ message: 'Nhóm cha phải là chuỗi chữ' })
  @IsNotEmpty({ message: 'Không được để trống nhóm cha' })
  nhom_cha!: string;

  @IsString({ message: 'Nhóm con phải là chuỗi chữ' })
  @IsNotEmpty({ message: 'Không được để trống nhóm con' })
  nhom_con!: string;
}

class ChiTietDoanhThuNhomDto {
  @IsNumber()
  @Min(0)
  dtt_ve!: number;

  @IsNumber()
  @Min(0)
  dt_theo_ve!: number;

  @IsOptional()
  @IsNumber()
  bhhk?: number;

  @IsOptional()
  @IsNumber()
  bhhk_thanh_tien?: number;

  @IsNumber()
  vat!: number;

  @IsNumber()
  vat_thanh_tien!: number;
}

export class CreateSanLuongDoanhThuDto {
  @IsOptional()
  @IsString()
  _id?: string;

  @IsDateString(
    {},
    { message: 'Ngày nhập phải đúng định dạng ngày tháng (YYYY-MM-DD)!' },
  )
  @IsNotEmpty({ message: 'Không được để trống ngày nhập liệu' })
  ngay_nhap!: string;

  @IsString({ message: 'THUC_HIEN | KE_HOACH' })
  @IsNotEmpty({ message: 'Không được để trống loại dữ liệu' })
  loai_du_lieu!: string;

  // 🌟 ĐÃ SỬA: Thêm @IsOptional() vì Backend tự động cắt chuỗi ngày_nhap để tạo ra "YYYY-MM"
  @IsOptional()
  @IsString()
  thang_nam?: string;

  @IsString({ message: 'Mã bến phải là chuỗi chữ (Ví dụ: TC, VC)' })
  @IsNotEmpty({ message: 'Không được để trống mã bến' })
  ma_ben!: string;

  @IsArray({ message: 'Chi tiết sản lượng phải là một danh sách mảng' })
  @ValidateNested({ each: true })
  @Type(() => ChiTietSanLuongDto)
  @IsNotEmpty({ message: 'Danh sách sản lượng không được để trống' })
  chi_tiet_san_luong!: ChiTietSanLuongDto[];

  @ValidateNested()
  @Type(() => ChiTietDoanhThuNhomDto)
  @IsNotEmpty({ message: 'Không được để trống khối doanh thu theo vé lượt' })
  doanh_thu_theo_ve!: ChiTietDoanhThuNhomDto;

  @ValidateNested()
  @Type(() => ChiTietDoanhThuNhomDto)
  @IsNotEmpty({ message: 'Không được để trống khối doanh thu vé tháng' })
  doanh_thu_ve_thang!: ChiTietDoanhThuNhomDto;

  @ValidateNested()
  @Type(() => ChiTietDoanhThuNhomDto)
  @IsNotEmpty({ message: 'Không được để trống khối doanh thu vé quý' })
  doanh_thu_ve_qui!: ChiTietDoanhThuNhomDto;

  @ValidateNested()
  @Type(() => ChiTietDoanhThuNhomDto)
  @IsNotEmpty({ message: 'Không được để trống khối doanh thu vé năm' })
  doanh_thu_ve_nam!: ChiTietDoanhThuNhomDto;

  @IsNumber()
  @Min(0)
  doanh_thu_hd_tai_chinh!: number;

  @IsNumber()
  @Min(0)
  doanh_thu_khac!: number;

  @IsNumber()
  @Min(0)
  doanh_thu_thuan_tong_cong!: number;
}
