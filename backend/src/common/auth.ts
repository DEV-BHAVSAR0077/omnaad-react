import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

export type SessionUser = { id: number; name: string; email: string; role: string | null; permissions: string[] };

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => context.switchToHttp().getRequest().user as SessionUser);
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(protected jwt: JwtService, protected db: DataSource) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.omnaad_session;
    if (!token) throw new UnauthorizedException('Please sign in.');
    let payload: { sub: number };
    try { payload = await this.jwt.verifyAsync(token); } catch { throw new UnauthorizedException('Your session has expired.'); }
    const [user] = await this.db.query(
      `SELECT u.id,u.name,u.email,r.name role FROM users u LEFT JOIN roles r ON r.id=u.role_id WHERE u.id=? LIMIT 1`, [payload.sub],
    );
    if (!user) throw new UnauthorizedException('Account not found.');
    const permissions = await this.db.query(
      `SELECT p.name FROM permissions p JOIN permission_role pr ON pr.permission_id=p.id JOIN users u ON u.role_id=pr.role_id WHERE u.id=?`, [user.id],
    );
    request.user = { ...user, permissions: permissions.map((item: { name: string }) => item.name) };
    return true;
  }
}

@Injectable()
export class AdminGuard extends SessionGuard {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const user = context.switchToHttp().getRequest().user as SessionUser;
    if (['admin', 'super admin'].includes((user.role || '').toLowerCase()) || user.permissions.length) return true;
    throw new ForbiddenException('Administration access is required.');
  }
}

@Injectable()
export class StudentGuard extends SessionGuard {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const user = context.switchToHttp().getRequest().user as SessionUser;
    if ((user.role || '').toLowerCase() === 'student') return true;
    throw new ForbiddenException('Student access is required.');
  }
}
