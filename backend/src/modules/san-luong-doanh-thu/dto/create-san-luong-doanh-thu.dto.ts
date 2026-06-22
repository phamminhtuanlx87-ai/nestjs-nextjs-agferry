import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateSanLuongDoanhThuDto {
  @IsDateString(
    {},
    {
      message: 'Ngày nhập phải đúng định dạng ngày tháng (YYYY-MM-DD)!',
    },
  )
  @IsNotEmpty({ message: 'Không được để trống ngày nhập liệu' })
  ngay_nhap!: string;

  @IsString({ message: 'Mã bến phải là chuỗi chữ (Ví dụ: TC, VC)' })
  @IsNotEmpty({ message: 'Không được để trống mã bến' })
  ma_ben!: string;

  @IsString({ message: 'Mã loại vé phải là chuỗi chữ' })
  @IsNotEmpty({ message: 'Không được để trống mã loại vé' })
  ma_loai_ve!: string;

  @IsNumber({}, { message: 'Sản lượng xe qua phà phải là một số cụ thể' })
  @Min(0, { message: 'Sản lượng không được là số âm' })
  @IsNotEmpty({ message: 'Không được để trống sản lượng' })
  san_luong!: number;
}
