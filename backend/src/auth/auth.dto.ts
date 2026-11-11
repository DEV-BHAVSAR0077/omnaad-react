import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class LoginDto { @IsEmail() email!: string; @IsString() password!: string; }
export class RegisterDto { @IsString() name!: string; @IsEmail() email!: string; @MinLength(8) password!: string; }
export class EmailDto { @IsEmail() email!: string; }
export class ResetDto { @IsEmail() email!: string; @IsString() token!: string; @MinLength(8) password!: string; }
export class ProfileDto { @IsString() name!: string; @IsEmail() email!: string; }
export class PasswordDto { @IsString() currentPassword!: string; @MinLength(8) password!: string; }
