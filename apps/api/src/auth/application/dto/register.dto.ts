/**
 * Register DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { UserRole } from '../../../users/domain/user.entity';
import { AUTH_VALIDATION_MESSAGES, AUTH_API_PROPERTY_DESCRIPTIONS, AUTH_API_PROPERTY_EXAMPLES } from '../../constants';
import { VALIDATION_RULES } from '../../../common/constants';

export class RegisterDto {
  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.USERNAME,
    example: AUTH_API_PROPERTY_EXAMPLES.USERNAME_REGISTER,
    minLength: VALIDATION_RULES.USERNAME.MIN_LENGTH,
  })
  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.USERNAME_REQUIRED })
  @MinLength(VALIDATION_RULES.USERNAME.MIN_LENGTH, {
    message: AUTH_VALIDATION_MESSAGES.USERNAME_MIN_LENGTH,
  })
  @Matches(VALIDATION_RULES.USERNAME.PATTERN, {
    message: AUTH_VALIDATION_MESSAGES.USERNAME_PATTERN,
  })
  username: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.EMAIL,
    example: AUTH_API_PROPERTY_EXAMPLES.EMAIL,
  })
  @IsEmail({}, { message: AUTH_VALIDATION_MESSAGES.EMAIL_INVALID })
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.EMAIL_REQUIRED })
  email: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.PASSWORD,
    example: AUTH_API_PROPERTY_EXAMPLES.PASSWORD,
    minLength: VALIDATION_RULES.PASSWORD.MIN_LENGTH,
  })
  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(VALIDATION_RULES.PASSWORD.MIN_LENGTH, {
    message: AUTH_VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  @Matches(VALIDATION_RULES.PASSWORD.PATTERN, {
    message: AUTH_VALIDATION_MESSAGES.PASSWORD_PATTERN,
  })
  password: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.FIRST_NAME,
    example: AUTH_API_PROPERTY_EXAMPLES.FIRST_NAME,
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.LAST_NAME,
    example: AUTH_API_PROPERTY_EXAMPLES.LAST_NAME,
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.ROLE,
    enum: UserRole,
    default: UserRole.USER,
    required: false,
  })
  @IsOptional()
  role?: UserRole;
}

