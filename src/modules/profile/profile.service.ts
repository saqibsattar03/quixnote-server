import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../data/schemas/user.schema';
import { UserDto } from '../../data/dtos/user.dto';
import {
  comparePassword,
  hashPassword,
} from '../../common/utils/passwordHashing.util';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(userDto: any): Promise<UserDocument> {
    let passwordHash = null;

    if (userDto.password) {
      passwordHash = await hashPassword(userDto.password);
    }
    const lowerCaseEmail = userDto.email.toLowerCase();

    const userExits = await this.userModel.findOne({ email: lowerCaseEmail });
    // const userExits = await this.profileService.fetchByEmail(lowerCaseEmail);
    if (userExits)
      throw new HttpException(
        'An account with this email already exists.',
        HttpStatus.UNAUTHORIZED,
      );
    const newUser = new this.userModel({
      fullName: userDto.fullName,
      email: lowerCaseEmail,
      password: passwordHash,
      role: userDto.role,
      scopes: userDto.scopes,
      // isSubscribed: userDto.isSubscribed,
      // isVerified: userDto.isVerified,
    });
    await newUser.save();
    return newUser;
  }

  async fetchByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  async fetchByEmailAndPassword(email: string) {
    return this.userModel.findOne({ email: email }).select('password');
  }

  async updateProfile(id, data): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException(' Profile does not exist');
    return this.userModel.findByIdAndUpdate(
      id,
      {
        fullName: data.fullName,
        city: data.city,
        profileImage: data.profileImage,
        state: data.state,
        country: data.country,
        scopes: data.scopes,
        role: data.role,
      },
      { new: true },
    );
  }

  async getAll(role: string): Promise<any> {
    return this.userModel
      .find({
        role: role.toUpperCase(),
        status: { $ne: 'DELETED' },
      })
      .sort({ createdAt: -1 });
  }

  async getUserById(userId): Promise<UserDto> {
    return this.userModel.findById(userId);
  }

  async changePassword(data): Promise<any> {
    const user = await this.userModel.findById(data.userId).select('password');
    if (!user) throw new HttpException('user not found.', HttpStatus.NOT_FOUND);
    const isValidPassword = await comparePassword(
      data.oldPassword,
      user.password,
    );
    if (!isValidPassword)
      throw new HttpException(
        'old password is incorrect.',
        HttpStatus.FORBIDDEN,
      );
    const hashedPassword = await hashPassword(data.newPassword);
    const differentPassword = await comparePassword(
      data.oldPassword,
      hashedPassword,
    );
    if (!differentPassword) {
      user.password = hashedPassword;
      await user.save();
      throw new HttpException('password changed successfully.', HttpStatus.OK);
    } else
      throw new HttpException(
        'old password and new password can not be same.',
        HttpStatus.FORBIDDEN,
      );
  }

  async deleteUser(id): Promise<any> {
    const result = await this.userModel.findById(id);
    if (!result) throw new BadRequestException('user could not be deleted');
    await this.userModel.findByIdAndUpdate(
      id,
      { status: 'DELETED' },
      { new: true },
    );
    throw new HttpException('user deleted successfully', HttpStatus.OK);
  }
}
