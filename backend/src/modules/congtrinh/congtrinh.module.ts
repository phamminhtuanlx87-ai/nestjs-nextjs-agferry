import { Module } from '@nestjs/common';
import { CongtrinhController } from './congtrinh.controller';
import { CongtrinhService } from './congtrinh.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CongTrinh, CongTrinhSchema } from './schemas/congtrinh.schemas';

@Module({
  imports: [
    // Đăng ký Schema ở đây để InjectModel có thể hoạt động trong Service
    MongooseModule.forFeature([
      { name: CongTrinh.name, schema: CongTrinhSchema },
    ]),
  ],
  controllers: [CongtrinhController],
  providers: [CongtrinhService],
})
export class CongtrinhModule {}
