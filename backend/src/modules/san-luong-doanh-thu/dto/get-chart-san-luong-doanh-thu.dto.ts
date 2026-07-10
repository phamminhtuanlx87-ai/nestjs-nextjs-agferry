import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum LoaiThoiGianBieuDo {
  HOM_NAY = 'HOM_NAY',
  BAY_NGAY_GAN_NHAT = 'BAY_NGAY_GAN_NHAT',
  BA_MUOI_NGAY_GAN_NHAT = 'BA_MUOI_NGAY_GAN_NHAT',
  THANG_NAY = 'THANG_NAY',
  QUI_NAY = 'QUI_NAY',
  NAM_NAY = 'NAM_NAY',
  TUY_CHON = 'TUY_CHON',
}

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
