/**
 * Login DTO
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MinLength } from "class-validator";
import {
  AUTH_VALIDATION_MESSAGES,
  AUTH_API_PROPERTY_DESCRIPTIONS,
  AUTH_API_PROPERTY_EXAMPLES,
} from "../../constants";
import { VALIDATION_RULES } from "../../../common/constants";

export class LoginDto {
  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.USERNAME,
    example: AUTH_API_PROPERTY_EXAMPLES.USERNAME,
  })
  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.USERNAME_REQUIRED })
  username: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.PASSWORD,
    example: AUTH_API_PROPERTY_EXAMPLES.PASSWORD_LOGIN,
    minLength: VALIDATION_RULES.PASSWORD.LOGIN_MIN_LENGTH,
  })
  @IsString()
  @IsNotEmpty({ message: AUTH_VALIDATION_MESSAGES.PASSWORD_REQUIRED })
  @MinLength(VALIDATION_RULES.PASSWORD.LOGIN_MIN_LENGTH, {
    message: AUTH_VALIDATION_MESSAGES.PASSWORD_LOGIN_MIN_LENGTH,
  })
  password: string;
}
