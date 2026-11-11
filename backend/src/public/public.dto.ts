import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';
export class ContactDto {
  @IsString() @MaxLength(255) first_name!: string;
  @IsString() @MaxLength(255) last_name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsString() subject!: string;
  @IsString() message!: string;
}
export class EventRegistrationDto {
  @IsString() @MaxLength(255) name!: string;
  @IsEmail() email!: string;
  @IsString() @MaxLength(20) phone!: string;
  @IsOptional() @IsString() notes?: string;
}
