import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../data/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from '../utils/passwordHashing.util';
import { UserDto } from '../../data/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(userDto: UserDto): Promise<UserDocument> {
    userDto.password = await hashPassword(userDto.password);
    const lowerCaseEmail = userDto.email.toLowerCase();

    const userExits = await this.userModel.findOne({ email: lowerCaseEmail });
    if (userExits)
      throw new HttpException(
        'An account with this email already exists.',
        HttpStatus.UNAUTHORIZED,
      );
    const newUser = new this.userModel({
      fullName: userDto.fullName,
      email: lowerCaseEmail,
      password: userDto.password,
      role: userDto.role,
      scopes: userDto.scopes,
      // isSubscribed: userDto.isSubscribed,
      // isVerified: userDto.isVerified,
    });
    await newUser.save();
    return newUser;
  }

  async validateUser(email: string, enteredPassword: string): Promise<any> {
    const user = await this.userModel
      .findOne({ email: email })
      .select('password');
    if (!user) {
      throw new NotAcceptableException(
        'An account with these credentials does not exist. Please create your account first.',
      );
    }
    const isValidPassword = await comparePassword(
      enteredPassword,
      user.password,
    );
    console.log(isValidPassword);
    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: { email: string }): Promise<any> {
    const fetchedUser = await this.userModel.findOne({ email: user.email });
    if (!fetchedUser || fetchedUser.status === 'DELETED') {
      throw new HttpException(
        'User not found. Please create an account first.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = {
      email: fetchedUser.email,
      sub: fetchedUser._id,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { user: fetchedUser, access_token };
  }

  async fetchUserProfileUsingToken(email: string): Promise<any> {
    const fetchedUser = await this.userModel.findOne({ email: email });
    if (!fetchedUser)
      throw new HttpException(
        'no user with entered username or email found',
        HttpStatus.NOT_FOUND,
      );
    return fetchedUser;
  }
}
