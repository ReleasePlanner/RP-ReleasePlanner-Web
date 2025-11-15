/**
 * Auth Controller
 * 
 * Presentation layer - HTTP endpoints for authentication
 */
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AUTH_API_OPERATION_SUMMARIES,
  AUTH_API_RESPONSE_DESCRIPTIONS,
  AUTH_HTTP_STATUS_CODES,
} from '../constants';
import { API_TAGS } from '../../common/constants';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { RegisterDto } from '../application/dto/register.dto';
import { AuthResponseDto } from '../application/dto/auth-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { CurrentUserPayload } from '../decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags(API_TAGS.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 registrations per minute
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: AUTH_API_OPERATION_SUMMARIES.REGISTER })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.CREATED,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.USER_REGISTERED,
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.BAD_REQUEST,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.INVALID_INPUT,
  })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.CONFLICT,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.USERNAME_EMAIL_EXISTS,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  @Throttle({ short: { limit: 10, ttl: 60000 } }) // 10 login attempts per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AUTH_API_OPERATION_SUMMARIES.LOGIN })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.OK,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.USER_LOGGED_IN,
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.UNAUTHORIZED,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.INVALID_CREDENTIALS,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: AUTH_API_OPERATION_SUMMARIES.REFRESH_TOKEN })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.OK,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.TOKEN_REFRESHED,
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.UNAUTHORIZED,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.INVALID_REFRESH_TOKEN,
  })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: AUTH_API_OPERATION_SUMMARIES.LOGOUT })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.NO_CONTENT,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.USER_LOGGED_OUT,
  })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.UNAUTHORIZED,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.UNAUTHORIZED,
  })
  async logout(@CurrentUser() user: CurrentUserPayload): Promise<void> {
    return this.authService.logout(user.id);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: AUTH_API_OPERATION_SUMMARIES.GET_CURRENT_USER })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.OK,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.CURRENT_USER_INFO,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: AUTH_HTTP_STATUS_CODES.UNAUTHORIZED,
    description: AUTH_API_RESPONSE_DESCRIPTIONS.UNAUTHORIZED,
  })
  async getCurrentUser(@CurrentUser() user: CurrentUserPayload) {
    return user;
  }
}

