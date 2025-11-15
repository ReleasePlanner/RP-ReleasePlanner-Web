/**
 * Auth Module
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';
import { UserRepository } from '../users/infrastructure/user.repository';
import { User } from '../users/domain/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JWT_CONFIG_DEFAULTS } from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          JWT_CONFIG_DEFAULTS.SECRET,
        signOptions: {
          expiresIn:
            configService.get<string>('JWT_EXPIRES_IN') ||
            JWT_CONFIG_DEFAULTS.ACCESS_TOKEN_EXPIRES_IN,
        },
      } as any),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, JwtStrategy, LocalStrategy],
  exports: [AuthService, UserRepository],
})
export class AuthModule {}

