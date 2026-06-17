import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO nhỏ cho File đính kèm
class ThongTinThemDto {
  @IsNumber()
  @IsOptional()
  ps_tang?: number;

  @IsNumber()
  @IsOptional()
  ps_giam?: number;

  @IsNumber()
  @IsOptional()
  cp_tham_tra_ps?: number;

  @IsString()
  @IsOptional()
  don_vi_giam_sat?: string;
}

// DTO nhỏ cho File đính kèm
class FileLinkDto {
  @IsString()
  @IsNotEmpty()
  link_name!: string;

  @IsString()
  @IsNotEmpty()
  link_url!: string;
}

// DTO nhỏ cho từng Giai đoạn
class GiaiDoanDto {
  @IsString()
  @IsNotEmpty()
  ma_hieu!: string;

  @IsString()
  @IsNotEmpty()
  ten_giai_doan!: string;

  @IsString()
  @IsOptional()
  ma_don_vi?: string;

  @IsString()
  @IsOptional()
  ten_don_vi?: string;

  @IsNumber()
  @IsOptional()
  tong_gia_tri?: number;

  @IsNumber()
  @IsOptional()
  chi_phi_xay_dung?: number;

  @IsNumber()
  @IsOptional()
  so_ngay_tc_pgv?: number;

  @IsNumber()
  @IsOptional()
  so_ngay_tc_thuc_te?: number;

  @IsString()
  @IsOptional()
  dia_diem_tc?: string;

  @IsDateString()
  @IsOptional()
  ngay_thuc_hien?: string;

  @IsDateString()
  @IsOptional()
  ngay_hoan_thanh?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileLinkDto)
  @IsOptional()
  file_links?: FileLinkDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ThongTinThemDto)
  thong_tin_them?: ThongTinThemDto;
}

// DTO CHÍNH để tạo Công Trình
export class CongTrinhDto {
  @IsString({ message: 'Tên công trình phải là chuỗi văn bản' })
  @IsNotEmpty({ message: 'Không được để trống tên công trình' })
  ten_cong_trinh!: string;

  @IsString()
  @IsNotEmpty()
  ma_cong_trinh!: string;

  @IsString()
  @IsOptional()
  don_vi_chu_quan?: string;

  @IsDateString()
  @IsOptional()
  ngay_tao_du_an?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true }) // Kiểm tra tính hợp lệ của từng phần tử trong mảng
  @Type(() => GiaiDoanDto) // Chuyển đổi kiểu dữ liệu cho đúng Class
  @IsOptional()
  giai_doan?: GiaiDoanDto[];
}
