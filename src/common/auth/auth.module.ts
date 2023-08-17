import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../../data/schemas/user.schema';
import { jwtConstants } from './guards/secret';
import { ProfileModule } from '../../modules/profile/profile.module';

@Module({
  imports: [
    PassportModule,
    ProfileModule,
    JwtModule.register({
      //save secret key in env file
      // secret: process.env.SECRET_KEY,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, AuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
