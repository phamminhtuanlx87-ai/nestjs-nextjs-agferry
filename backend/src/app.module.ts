import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './modules/products/products.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { ConfigModule } from '@nestjs/config';
import { CongtrinhModule } from './modules/congtrinh/congtrinh.module';

// 1. IMPORT CÁC THÀNH PHẦN CỦA THROTTLER VÀO ĐÂY
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { DanhMucGiaVeModule } from './modules/danh-muc-gia-ve/danh-muc-gia-ve.module';
import { SanLuongDoanhThuModule } from './modules/san-luong-doanh-thu/san-luong-doanh-thu.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env', // Chỉ định rõ file của bạn
      isGlobal: true, // Giúp các module khác như Auth, Users không cần import lại
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI!, {
      autoIndex: true, // Thần chú bắt buộc MongoDB quét và nạp lại unique index
    }),

    // 2. CẤU HÌNH BỘ KHUNG CHẶN SPAM CHO TOÀN HỆ THỐNG
    ThrottlerModule.forRoot([
      {
        name: 'short', // Quy tắc 1: Chống click đúp chuột liên tục phá hoại
        ttl: 1000, // Trong vòng 1 giây (1000ms)
        limit: 2, // Chỉ được phép bấm tối đa 1 lần
      },
      {
        name: 'medium', // Quy tắc 2: Chống spam gửi form/gọi dữ liệu liên tục
        ttl: 60000, // Trong vòng 1 phút (60000ms)
        limit: 20, // Chỉ được phép gọi tối đa 10 lần
      },
      {
        name: 'longTermSpam',
        ttl: 300000, // 10 phút tính bằng miligiây (10 * 60 * 1000)
        limit: 30, // Nếu chạm ngưỡng 15 request trong thời gian này, khóa luôn 10 phút
      },
    ]),

    ProductsModule,
    UsersModule,
    AuthModule,
    CongtrinhModule,
    DanhMucGiaVeModule,
    SanLuongDoanhThuModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // TỰ ĐỘNG CHẶN SPAM (Đứng cuối danh sách kiểm tra)
    },
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Tự động khóa tất cả API bằng JWT đầu tiên
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Tự động kiểm tra Quyền (Role) tiếp theo
    },
  ],
})
export class AppModule {}
