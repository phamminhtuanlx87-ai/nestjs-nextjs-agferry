import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userName: string, pass: string): Promise<any> {
    // 1. Tìm user (Lưu ý: Bạn cần hàm findByUserName bên UsersService)
    // Nếu trong Schema bạn để password { select: false },
    // thì ở đây bạn phải dùng .select('+password') để lấy nó ra so sánh.
    const user = await this.usersService.findWithPassword(userName);
    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    // 2. So sánh mật khẩu bằng bcrypt
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }
    // 3. Nếu đúng, trả về thông tin user (ẩn mật khẩu)
    const { passwordHash, ...result } = user.toObject();
    void passwordHash;
    return {
      message: 'Đăng nhập thành công',
      user: result,
    };
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  login(user: any) {
    const payload = {
      sub: user._id,
      userName: user.userName,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
