import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // 2. Cấu hình mở CORS - Đây chính là chìa khóa!
  // 2. Cấu hình mở CORS - Đã cập nhật để chạy cả Local và Production
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL, 'https://nestjs-nextjs-agferry.vercel.app'] // Điền link Next.js production của bạn vào đây
        : 'http://localhost:3001', // Khi chạy ở máy local
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Dòng này cực kỳ quan trọng để kích hoạt class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động loại bỏ các trường không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu gửi lên trường "lạ"
      transform: true, // Tự động convert kiểu dữ liệu
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
