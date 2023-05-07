import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireRole = this.reflector.getAllAndOverride<string>('role', [context.getHandler(), context.getClass()]);

    if (!requireRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userRole = (await this.authService.checkUserById(user.id)).role;

    return requireRole === userRole;
  }
}
