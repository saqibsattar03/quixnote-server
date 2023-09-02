import {
  Body,
  Controller,
  Patch,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwtAuth.guard';
import { UpdateUserDto, UserDto } from '../../data/dtos/user.dto';

@ApiTags('Person')
@Controller('person')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Patch('/:id')
  @ApiParam({ type: String, name: 'id' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateUserDto })
  // @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse({ description: 'could not update Profile' })
  async updateProfile(@Param('id') id, @Body() data) {
    data.userId = id;
    return this.profileService.updateProfile(data);
  }

  @Get('/all/:role')
  @ApiBearerAuth('access-token')
  @ApiParam({ type: String, name: 'role' })
  @ApiResponse({ type: UserDto })
  @ApiUnauthorizedResponse()
  @UseGuards(JwtAuthGuard)
  getAllAdmins(@Param('role') role) {
    return this.profileService.getAll(role);
  }

  @Get('/:id')
  @ApiParam({ type: String, name: 'id' })
  @ApiResponse({ type: UserDto })
  getUserById(@Param('id') id) {
    return this.profileService.getUserById(id);
  }

  @Patch('/update-password/:id')
  @ApiParam({ type: String, name: 'id' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  @ApiResponse({ description: 'password updated successfully' })
  @ApiBadRequestResponse({ description: 'could not update  password' })
  @UseGuards(JwtAuthGuard)
  changePassword(@Param('id') id, @Body() data) {
    console.log(data);
    console.log(id);
    data.userId = id;
    return this.profileService.changePassword(data);
  }

  @Delete('/:id')
  @ApiParam({ type: String, name: 'id' })
  deleteUser(@Param('id') id) {
    return this.profileService.deleteUser(id);
  }
}
