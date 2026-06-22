import { Module } from '@nestjs/common';
import { SanLuongDoanhThuService } from './san-luong-doanh-thu.service';
import { SanLuongDoanhThuController } from './san-luong-doanh-thu.controller';
import {
  SanLuongDoanhThu,
  SanLuongDoanhThuSchema,
} from './entities/san-luong-doanh-thu.entity';
import {
  DanhMucGiaVe,
  DanhMucGiaVeSchema,
} from '../danh-muc-gia-ve/entities/danh-muc-gia-ve.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SanLuongDoanhThu.name,
        schema: SanLuongDoanhThuSchema,
        collection: 'san_luong_doanh_thu',
      },
      {
        name: DanhMucGiaVe.name,
        schema: DanhMucGiaVeSchema,
        collection: 'danh_muc_gia_ve',
      }, // Đăng ký để Service dùng được
    ]),
  ],
  controllers: [SanLuongDoanhThuController],
  providers: [SanLuongDoanhThuService],
})
export class SanLuongDoanhThuModule {}
