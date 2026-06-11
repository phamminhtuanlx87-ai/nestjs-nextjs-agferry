import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  private currentContext!: ExecutionContext;
  canActivate(context: ExecutionContext) {
    this.currentContext = context;
    // 1. Dùng Reflector để kiểm tra xem route hoặc class có nhãn @Public không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Nếu là Public, cho qua luôn, không cần check JWT
    if (isPublic) {
      return true;
    }

    // 3. Nếu không phải Public, chạy logic kiểm tra JWT mặc định của cha
    return super.canActivate(context);
  }

  // ==================== THÊM ĐOẠN NÀY VÀO DƯỚI ĐÂY ====================
  handleRequest(err: any, user: any) {
    // Nếu có lỗi xác thực hoặc không tìm thấy user từ token (chưa đăng nhập / token hết hạn)
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Phiên đăng nhập không hợp lệ hoặc đã hết hạn!',
        )
      );
    }

    // Lấy thông tin về phương thức API (GET, POST, PUT, DELETE...)
    const request = this.currentContext.switchToHttp().getRequest();
    const method = request.method;

    // CHỐT CHẶN PHÂN QUYỀN MỚI:
    // Nếu tài khoản bị khóa (isActive === false) VÀ user đang cố tình GHI dữ liệu (POST, PUT, DELETE, PATCH)
    if (user.isActive === false && method !== 'GET') {
      throw new ForbiddenException(
        'Tài khoản của bạn đã bị khóa tính năng chỉnh sửa dữ liệu!',
      );
    }

    // Nếu mọi thứ đều ngon lành, trả về user để truyền vào request cho Controller xài
    return user;
  }
}
