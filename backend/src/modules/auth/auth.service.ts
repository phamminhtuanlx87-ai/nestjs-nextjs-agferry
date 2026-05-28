import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService, // Inject ConfigService
  ) {}

  // --- HÀM TẠO TOKEN DÙNG CHUNG ---
  // auth.service.ts
  async generateTokens(payload: any) {
    const { iat, exp, ...cleanPayload } = payload;
    void iat;
    void exp;

    const [accessToken, refreshToken] = await Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.jwtService.signAsync(cleanPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: (this.configService.get<string>('JWT_EXPIRE') ||
          '15m') as any, // Thêm "as any" ở đây
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.jwtService.signAsync(cleanPayload, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET'),
        expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRE') ||
          '7d') as any, // Và ở đây
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Hàm này để Frontend gọi khi Access Token hết hạn
  async refreshTokens(rt: string) {
    try {
      // 1. Xác thực Refresh Token
      const payload = await this.jwtService.verifyAsync(rt, {
        secret:
          this.configService.get<string>('JWT_REFRESH_SECRET') ||
          this.configService.get<string>('JWT_SECRET'),
      });
      // ==================== BƯỚC CHÈN THÊM ĐỂ CẬP NHẬT TRẠNG THÁI ====================
      const userId = payload.sub;
      const user = await this.usersService.findOne(userId as string);
      // CHỐT CHẶN BẢO MẬT: Nếu tài khoản bị xóa hoặc Admin đã đổi isActive thành false
      if (!user || user.isActive === false) {
        throw new UnauthorizedException(
          'Tài khoản của bạn đã bị khóa hoặc ngừng hoạt động!',
        );
      }
      // Chuẩn bị một cái Payload MỚI, cập nhật chính xác trạng thái từ DB vừa lấy được
      const newPayload = {
        sub: (user as any)._id,
        userName: user.userName,
        role: user.role,
        isActive: user.isActive, // Luôn luôn là true mới được đi tiếp
      };
      // =============================================================================

      // 2. Nếu ok, tạo cặp Token mới
      return this.generateTokens(newPayload);
    } catch {
      throw new UnauthorizedException(
        'Phiên làm việc đã kết thúc, vui lòng đăng nhập lại',
      );
    }
  }

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

  async login(user: any) {
    const payload = {
      sub: user._id,
      userName: user.userName,
      role: user.role,
      isActive: user.isActive,
    };
    const tokens = await this.generateTokens(payload);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user._id,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive,
      },
    };
  }
}
