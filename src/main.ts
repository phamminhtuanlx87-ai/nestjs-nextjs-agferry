import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
