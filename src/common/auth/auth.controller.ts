import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { SocialAuthDto, UserDto } from '../../data/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwtAuth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  @ApiBody({ type: UserDto })
  signUp(@Body() userData) {
    console.log('user data :: ', userData);
    return this.authService.signUp(userData);
  }

  @Post('/sign-in')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  signIn(@Request() request: any): Promise<any> {
    console.log('request :: ', request.body);
    return this.authService.signIn(request.body);
  }

  @Post('/sign-in-via-email')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
    },
  })
  signInViaEmail(@Request() request: any): Promise<any> {
    console.log('request :: ', request.body);
    return this.authService.signInViaEmail(request.body);
  }

  @Get('/person')
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({
    type: UserDto,
    description: 'Get Profile from access token',
  })
  @ApiBadRequestResponse({ description: 'token is not valid' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  fetchUserProfileUsingToken(@Request() request) {
    return this.authService.fetchUserProfileUsingToken(request.user.email);
  }

  @ApiBadRequestResponse({ description: 'Issue in request data' })
  @ApiNotAcceptableResponse({
    description:
      'Account with this email already exists, kindly SignIn through Email and Password!',
  })
  @ApiUnauthorizedResponse({ description: 'Email already exists' })
  @Post('/social-sign-in')
  socialSignIn(@Body() data: SocialAuthDto) {
    console.log('called');
    return this.authService.socialSignIn(data);
  }

  @Post('/validate-idToken/:token')
  validateIdToken(@Param('token') token) {
    console.log(token);
    return this.authService.validateIDToken(token);
  }
}
