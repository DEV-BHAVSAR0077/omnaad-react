import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';
export class ParticipantDto { @IsString() name!: string; @IsOptional() @IsEmail() email?: string; @IsOptional() @IsString() mobile?: string; @IsOptional() @IsString() instrument?: string; @IsOptional() @IsString() experience_level?: string; }
export class CreateJamDto {
  @IsOptional() @IsString() session_type?: string;
  @IsOptional() @IsString() session_name?: string;
  @IsOptional() @IsString() genre?: string;
  @IsDateString() session_date!: string;
  @IsString() session_time!: string;
  @Transform(({value}) => Number(value)) @IsInt() @Min(1) @Max(12) duration!: number;
  @IsString() firstname!: string;
  @IsString() lastname!: string;
  @IsEmail() email!: string;
  @IsString() @MaxLength(20) phone_number!: string;
  @IsOptional() @IsString() @MaxLength(1000) description?: string;
  @IsOptional() @IsString() objective?: string;
  @IsOptional() @IsString() special_requirements?: string;
  @IsOptional() @Transform(({value}) => typeof value === 'string' ? JSON.parse(value) : value) @IsArray() participants?: ParticipantDto[];
}
