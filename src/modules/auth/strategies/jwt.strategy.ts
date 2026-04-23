import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ Header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!, // Sử dụng biến môi trường để lưu secret key
    });
  }

  validate(payload: any) {
    // Trả về dữ liệu này sẽ được gắn vào request.user
    return {
      userId: payload.sub,
      userName: payload.userName,
      role: payload.role,
    };
  }
}
