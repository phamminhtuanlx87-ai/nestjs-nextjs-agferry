import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/users/constants/user.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Kiểm tra nếu API có nhãn @Public thì cho qua luôn
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // 2. Lấy danh sách Roles yêu cầu từ Decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;

    // 3. So sánh với Role của User (đã được JwtStrategy giải mã vào req.user)
    const { user } = context.switchToHttp().getRequest();

    // 3. So sánh thực sự
    if (!user || !user.role) {
      return false; // Không có user hoặc role thì chặn ngay
    }

    // Chỉ cho phép nếu role của user nằm trong danh sách requiredRoles
    const canPass = requiredRoles.includes(user.role as UserRole);

    console.log('Quyết định cuối cùng của Guard:', canPass);
    return canPass;
  }
}
