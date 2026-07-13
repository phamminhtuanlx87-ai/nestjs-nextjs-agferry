import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LoaiThoiGianBieuDo } from '../constants/mapping_ben_pha';

export class GetChartSanLuongDoanhThuDto {
  @IsOptional()
  @IsEnum(LoaiThoiGianBieuDo, {
    message: 'time không thuộc loại thời gian hợp lệ',
  })
  time: LoaiThoiGianBieuDo = LoaiThoiGianBieuDo.THANG_NAY;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString({ message: 'location phải là chuỗi' })
  @IsNotEmpty({ message: 'location không được để trống' })
  location: string = 'ALL';
}
