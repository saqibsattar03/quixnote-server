import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ type: String, name: 'fullName' })
  fullName: string;

  @ApiProperty({ type: String, name: 'email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, name: 'password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ type: String, name: 'role' })
  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, name: 'loginVia' })
  // @IsOptional()
  loginVia: string;

  @ApiProperty({ type: String, name: 'scopes' })
  scopes: string;

  @ApiProperty({ type: Boolean, name: 'notificationPreference' })
  notificationPreference: boolean;

  @ApiProperty({ type: Boolean, name: 'isSubscribed' })
  isSubscribed: boolean;

  @ApiProperty({ type: Boolean, name: 'isVerified' })
  isVerified: boolean;

  @ApiProperty({ type: String, name: 'city' })
  city: string;

  @ApiProperty({ type: String, name: 'country' })
  country: string;

  @ApiProperty({ type: String, name: 'profileImage' })
  profileImage: string;

  @ApiProperty({ type: String, name: 'state' })
  state: string;
}

export class UpdateUserDto {
  @ApiProperty({ type: String, name: 'fullName' })
  fullName: string;

  @ApiProperty({ type: String, name: 'city' })
  city: string;

  @ApiProperty({ type: String, name: 'state' })
  state: string;

  @ApiProperty({ type: String, name: 'country' })
  country: string;

  @ApiProperty({ type: String, name: 'role' })
  role: string;

  @ApiProperty({ type: String, name: 'status' })
  status: string;

  @ApiProperty({ type: String, name: 'scopes' })
  scopes: string;

  @ApiProperty({ type: String, name: 'profileImage' })
  profileImage: string;
}

export class SocialAuthDto {
  @ApiProperty({ type: String, name: 'fullName' })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ type: String, name: 'email' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, name: 'role' })
  role: string;

  @ApiProperty({ type: String, name: 'loginVia' })
  // @IsOptional()
  loginVia: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, name: 'idToken' })
  idToken: string;

  @ApiProperty({ type: String, name: 'scopes' })
  scopes: string;

  @ApiProperty({ type: Boolean, name: 'notificationPreference' })
  notificationPreference: boolean;

  @ApiProperty({ type: Boolean, name: 'isSubscribed' })
  isSubscribed: boolean;

  @ApiProperty({ type: Boolean, name: 'isVerified' })
  isVerified: boolean;

  @ApiProperty({ type: String, name: 'city' })
  city: string;

  @ApiProperty({ type: String, name: 'country' })
  country: string;

  @ApiProperty({ type: String, name: 'state' })
  state: string;
}
