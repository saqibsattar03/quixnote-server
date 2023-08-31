import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProfileModule } from '../../modules/profile/profile.module';
import * as process from 'process';

@Module({
  imports: [
    PassportModule,
    ProfileModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      // secret: 'SecretKey',
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, AuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
