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
import { SocialAuthDto, UserDto } from '../../data/dtos/user.dto';
import * as firebase from 'firebase-admin';
import { Validations } from '../lib/validation';
import * as process from 'process';
import { ProfileService } from '../../modules/profile/profile.service';

@Injectable()
export class AuthService {
  private defaultApp: any;
  constructor(
    private readonly profileService: ProfileService,
    private jwtService: JwtService,
  ) {
    const firebase_params = {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CER_URL,
    };
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
    });
  }

  async signUp(userDto: any) {
    return this.profileService.createUser(userDto);
  }

  async validateUser(email: string, enteredPassword: string): Promise<any> {
    const user = await this.profileService.fetchByEmailAndPassword(email);
    // const user = await this.userModel
    //   .findOne({ email: email })
    //   .select('password');
    if (!user) {
      throw new NotAcceptableException(
        'An account with these credentials does not exist. Please create your account first.',
      );
    }
    const isValidPassword = await comparePassword(
      enteredPassword,
      user.password,
    );
    if (user && isValidPassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signIn(user: any): Promise<any> {
    // const fetchedUser = await this.userModel.findOne({ email: user.email });
    const fetchedUser = await this.profileService.fetchByEmail(user.email);
    if (!fetchedUser || fetchedUser.status === 'DELETED') {
      throw new HttpException(
        'User not found. Please create an account first.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // const payload = {
    //   email: fetchedUser.email,
    //   sub: fetchedUser._id,
    // };

    return {
      access_token: await this.jwtService.signAsync({
        email: fetchedUser.email,
        sub: fetchedUser._id,
      }),

      // const access_token = await this.jwtService.signAsync(payload);
      //
      // return { user: fetchedUser, access_token };
    };
  }

  async signInViaEmail(user: any): Promise<any> {
    const fetchedUser = await this.profileService.fetchByEmail(user.email);
    if (!fetchedUser || fetchedUser.status === 'DELETED') {
      throw new HttpException(
        'User not found. Please create an account first.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      access_token: await this.jwtService.signAsync({
        email: fetchedUser.email,
        sub: fetchedUser._id,
      }),

      // const access_token = await this.jwtService.signAsync(payload);
      //
      // return { user: fetchedUser, access_token };
    };
  }

  async fetchUserProfileUsingToken(email: string): Promise<any> {
    const fetchedUser = await this.profileService.fetchByEmail(email);
    // const fetchedUser = await this.userModel.findOne({ email: email });
    if (!fetchedUser)
      throw new HttpException(
        'no user with entered email found',
        HttpStatus.NOT_FOUND,
      );
    return fetchedUser;
  }

  async validateIDToken(idToken: string): Promise<boolean> {
    return await new Promise<boolean>((resolve) => {
      this.defaultApp
        .auth()
        .verifyIdToken(idToken)
        .then(async () => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  async socialSignIn(data: SocialAuthDto) {
    console.log('here in social sign in');
    // if (!(await Validations.ValidateLoginOption(data.loginVia))) {
    //   throw new HttpException(
    //     'Invalid login option!',
    //     HttpStatus.NOT_ACCEPTABLE,
    //   );
    // }
    if (await this.validateIDToken(data.idToken)) {
      const user = await this.profileService.fetchByEmail(data.email);
      if (user) {
        if (user.loginVia != data.loginVia) {
          throw new HttpException(
            'Account with this email already exists, kindly sign in with email and password!',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        return await this.signIn(user);
      } else {
        const person = (await this.signUp(data)) as any;
        if (person) {
          return await this.signIn(person);
        }
      }
    } else {
      throw new HttpException(
        'Unauthorized request!',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
