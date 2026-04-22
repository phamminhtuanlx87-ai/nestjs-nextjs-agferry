import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auths.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule, // THÊM DÒNG NÀY để lấy toàn bộ "hàng hóa" mà UsersModule đã export
    PassportModule,
    JwtModule.register({
      secret: 'AN_GIANG_FERRY_SECRET_KEY', // Sau này nên để trong file .env
      signOptions: { expiresIn: '1d' }, // Token có hiệu lực trong 1 ngày
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
