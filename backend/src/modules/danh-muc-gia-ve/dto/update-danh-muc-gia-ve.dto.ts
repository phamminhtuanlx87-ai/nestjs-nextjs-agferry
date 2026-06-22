import { PartialType } from '@nestjs/mapped-types';
import { CreateDanhMucGiaVeDto } from './create-danh-muc-gia-ve.dto';

export class UpdateDanhMucGiaVeDto extends PartialType(CreateDanhMucGiaVeDto) {}
