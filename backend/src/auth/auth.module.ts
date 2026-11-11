import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminGuard, SessionGuard, StudentGuard } from '../common/auth';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || 'development-only-change-me', signOptions: { expiresIn: '7d' } })],
  controllers: [AuthController, VerificationController],
  providers: [AuthService, VerificationService, SessionGuard, AdminGuard, StudentGuard],
  exports: [JwtModule, SessionGuard, AdminGuard, StudentGuard],
})
export class AuthModule {}
