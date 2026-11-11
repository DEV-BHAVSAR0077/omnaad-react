import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { createHash, randomBytes } from 'node:crypto';
import { DataSource } from 'typeorm';
import nodemailer from 'nodemailer';
import { EmailDto, LoginDto, PasswordDto, ProfileDto, RegisterDto, ResetDto } from './auth.dto';
import { SessionUser } from '../common/auth';

@Injectable()
export class AuthService {
  constructor(private db: DataSource, private jwt: JwtService) {}
  private safe(user: Record<string, unknown>) { const { password: _password, remember_token: _remember, ...safe } = user; return safe; }
  private async roleAndPermissions(id: number) {
    const [user] = await this.db.query(`SELECT u.id,u.name,u.email,u.email_verified_at,r.name role FROM users u LEFT JOIN roles r ON r.id=u.role_id WHERE u.id=?`, [id]);
    const permissions = await this.db.query(`SELECT p.name FROM permissions p JOIN permission_role pr ON pr.permission_id=p.id JOIN users u ON u.role_id=pr.role_id WHERE u.id=?`, [id]);
    return { ...user, permissions: permissions.map((item: {name:string}) => item.name) };
  }
  async login(dto: LoginDto) {
    const [user] = await this.db.query(`SELECT * FROM users WHERE email=? LIMIT 1`, [dto.email.toLowerCase()]);
    const compatibleHash = String(user?.password || '').replace(/^\$2y\$/, '$2a$');
    if (!user || !(await compare(dto.password, compatibleHash))) throw new UnauthorizedException('The supplied credentials are invalid.');
    return { token: await this.jwt.signAsync({ sub: user.id }), user: await this.roleAndPermissions(user.id) };
  }
  async register(dto: RegisterDto) {
    const [exists] = await this.db.query(`SELECT id FROM users WHERE email=?`, [dto.email.toLowerCase()]);
    if (exists) throw new BadRequestException('That email address is already registered.');
    const [studentRole] = await this.db.query(`SELECT id FROM roles WHERE LOWER(name)='student' LIMIT 1`);
    const result = await this.db.query(`INSERT INTO users (name,email,password,role_id,created_at,updated_at) VALUES (?,?,?,?,NOW(),NOW())`, [dto.name, dto.email.toLowerCase(), await hash(dto.password, 12), studentRole?.id || null]);
    await this.db.query(`INSERT INTO students (user_id,created_at,updated_at) VALUES (?,NOW(),NOW())`, [result.insertId]);
    return { token: await this.jwt.signAsync({ sub: result.insertId }), user: await this.roleAndPermissions(result.insertId) };
  }
  async forgot(dto: EmailDto) {
    const [user] = await this.db.query(`SELECT id FROM users WHERE email=?`, [dto.email.toLowerCase()]);
    if (!user) return { message: 'If the account exists, a reset link has been sent.' };
    const token = randomBytes(32).toString('hex');
    const digest = createHash('sha256').update(token).digest('hex');
    await this.db.query(`REPLACE INTO password_reset_tokens (email,token,created_at) VALUES (?,?,NOW())`, [dto.email.toLowerCase(), digest]);
    await this.sendMail(dto.email, 'Reset your Om Naad password', `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(dto.email)}&token=${token}`);
    return { message: 'If the account exists, a reset link has been sent.' };
  }
  async reset(dto: ResetDto) {
    const digest = createHash('sha256').update(dto.token).digest('hex');
    const [row] = await this.db.query(`SELECT email FROM password_reset_tokens WHERE email=? AND token=? AND created_at > DATE_SUB(NOW(), INTERVAL 60 MINUTE)`, [dto.email.toLowerCase(), digest]);
    if (!row) throw new BadRequestException('This reset link is invalid or expired.');
    await this.db.transaction(async (manager) => {
      await manager.query(`UPDATE users SET password=?,remember_token=NULL,updated_at=NOW() WHERE email=?`, [await hash(dto.password, 12), dto.email.toLowerCase()]);
      await manager.query(`DELETE FROM password_reset_tokens WHERE email=?`, [dto.email.toLowerCase()]);
    });
    return { message: 'Password updated.' };
  }
  async updateProfile(user: SessionUser, dto: ProfileDto) {
    const [conflict] = await this.db.query(`SELECT id FROM users WHERE email=? AND id<>?`, [dto.email.toLowerCase(), user.id]);
    if (conflict) throw new BadRequestException('That email is already in use.');
    await this.db.query(`UPDATE users SET name=?,email=?,email_verified_at=IF(email=?,email_verified_at,NULL),updated_at=NOW() WHERE id=?`, [dto.name,dto.email.toLowerCase(),user.email,user.id]);
    return this.roleAndPermissions(user.id);
  }
  async updatePassword(user: SessionUser, dto: PasswordDto) {
    const [record] = await this.db.query(`SELECT password FROM users WHERE id=?`, [user.id]);
    if (!record || !(await compare(dto.currentPassword, String(record.password).replace(/^\$2y\$/, '$2a$')))) throw new BadRequestException('Current password is incorrect.');
    await this.db.query(`UPDATE users SET password=?,updated_at=NOW() WHERE id=?`, [await hash(dto.password, 12), user.id]);
    return { message: 'Password updated.' };
  }
  private async sendMail(to: string, subject: string, text: string) {
    if (!process.env.MAIL_HOST) return;
    const transport = nodemailer.createTransport({ host: process.env.MAIL_HOST, port: Number(process.env.MAIL_PORT || 587), secure: process.env.MAIL_SECURE === 'true', auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD } });
    await transport.sendMail({ from: process.env.MAIL_FROM || 'Om Naad <noreply@example.com>', to, subject, text });
  }
}
