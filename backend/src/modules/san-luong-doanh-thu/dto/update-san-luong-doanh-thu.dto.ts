import { PartialType } from '@nestjs/mapped-types';
import { CreateSanLuongDoanhThuDto } from './create-san-luong-doanh-thu.dto';

export class UpdateSanLuongDoanhThuDto extends PartialType(
  CreateSanLuongDoanhThuDto,
) {}
