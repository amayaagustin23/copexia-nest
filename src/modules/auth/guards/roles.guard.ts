import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const userFound = await this.prisma.user.findUnique({
      where: { id: user.userId },
    });
    if (!userFound) {
      throw new ForbiddenException('El usuario no existe');
    }

    const hasRole = requiredRoles.includes(userFound.role);
    if (!hasRole) {
      throw new ForbiddenException('El usuario no existe');
    }

    request.user = user;

    return true;
  }
}
