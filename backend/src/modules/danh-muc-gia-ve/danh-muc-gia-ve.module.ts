import { Module } from '@nestjs/common';
import { DanhMucGiaVeService } from './danh-muc-gia-ve.service';
import { DanhMucGiaVeController } from './danh-muc-gia-ve.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DanhMucGiaVe,
  DanhMucGiaVeSchema,
} from './entities/danh-muc-gia-ve.entity';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule,
    // Đăng ký Schema ở đây để InjectModel có thể hoạt động trong Service
    MongooseModule.forFeature([
      {
        name: DanhMucGiaVe.name,
        schema: DanhMucGiaVeSchema,
        collection: 'danh_muc_gia_ve',
      },
    ]),
  ],
  controllers: [DanhMucGiaVeController],
  providers: [DanhMucGiaVeService],
})
export class DanhMucGiaVeModule {}
