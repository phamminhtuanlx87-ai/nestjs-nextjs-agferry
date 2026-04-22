import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
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
}
