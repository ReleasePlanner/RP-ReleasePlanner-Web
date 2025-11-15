/**
 * Auth Response DTO
 */
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../users/domain/user.entity';
import { AUTH_API_PROPERTY_DESCRIPTIONS, AUTH_API_PROPERTY_EXAMPLES } from '../../constants';

export class AuthResponseDto {
  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.ACCESS_TOKEN,
    example: AUTH_API_PROPERTY_EXAMPLES.TOKEN,
  })
  accessToken: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.REFRESH_TOKEN,
    example: AUTH_API_PROPERTY_EXAMPLES.TOKEN,
  })
  refreshToken: string;

  @ApiProperty({
    description: AUTH_API_PROPERTY_DESCRIPTIONS.USER_INFO,
  })
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  };
}

