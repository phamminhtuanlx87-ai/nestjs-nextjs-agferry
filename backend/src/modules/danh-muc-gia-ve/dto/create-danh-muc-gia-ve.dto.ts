import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

// 1. Khai báo các Class con trước để làm bệ phóng cho Class cha phía dưới
class GiaTheoBenDTO {
  @IsString({ message: 'Mã nhóm bến phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống mã nhóm bến' })
  ma_nhom_ben!: string; // CHUNG | TC_VC

  @IsNumber({}, { message: 'Giá vé phải là số' })
  @IsNotEmpty({ message: 'Không được để trống giá vé' })
  gia_ve!: number;

  @IsString()
  @IsOptional()
  ghi_chu?: string;
}

class LichSuGiaDTO {
  @IsDateString(
    {},
    { message: 'Ngày áp dụng phải là định dạng ngày tháng hợp lệ' },
  )
  @IsNotEmpty({ message: 'Không được để trống ngày áp dụng' })
  ngay_ap_dung!: string | Date;

  @IsArray({ message: 'Danh sách giá theo bến phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => GiaTheoBenDTO)
  @IsNotEmpty({ message: 'Không được để trống giá theo bến' })
  gia_theo_ben!: GiaTheoBenDTO[];
}

class LichSuBHHKDto {
  @IsDateString(
    {},
    { message: 'Ngày áp dụng phải là định dạng ngày tháng hợp lệ' },
  )
  @IsNotEmpty({ message: 'Không được để trống ngày áp dụng' })
  ngay_ap_dung!: string | Date;

  @IsNumber({}, { message: 'Giá bhhk phải là số' })
  @IsNotEmpty({ message: 'Không được để trống Giá bhhk phải là số' })
  gia_bhhk!: number;
}

// 2. Class cha chính dùng để nhận dữ liệu từ Frontend truyền lên
export class CreateDanhMucGiaVeDto {
  @IsString({ message: 'Mã loại vé phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống mã loại vé' })
  ma_loai_ve!: string;

  @IsString({ message: 'Tên loại vé phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống tên loại vé' })
  ten_loai_ve!: string;

  @IsString({ message: 'Tên nhóm cha phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống tên nhóm cha' })
  nhom_cha!: string; // HANH_KHACH | XE_CAC_LOAI | THUE_BAO

  @IsString({ message: 'Tên nhóm con phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống tên nhóm con' })
  nhom_con!: string; // HANH_KHACH | XE_KHACH | XE_TAI

  @IsArray({ message: 'Lịch sử giá phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => LichSuGiaDTO)
  @IsNotEmpty({ message: 'Không được để trống lịch sử giá' })
  lich_su_gia!: LichSuGiaDTO[];

  @IsArray({ message: 'Lịch sử bhhk phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => LichSuBHHKDto)
  @IsNotEmpty({ message: 'Không được để trống Lịch sử bhhk' })
  lich_su_bhhk!: LichSuBHHKDto[];

  @IsBoolean({ message: 'Trạng thái kích hoạt phải là true hoặc false' })
  @IsNotEmpty({ message: 'Không được để trống trạng thái kích hoạt' })
  kich_hoat!: boolean;
}
