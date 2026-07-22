import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CongTrinh,
  CongTrinhSchema,
} from '../congtrinh/schemas/congtrinh.schemas';
import {
  SanLuongDoanhThu,
  SanLuongDoanhThuSchema,
} from '../san-luong-doanh-thu/entities/san-luong-doanh-thu.entity';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: CongTrinh.name, schema: CongTrinhSchema },
      { name: SanLuongDoanhThu.name, schema: SanLuongDoanhThuSchema },
    ]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
