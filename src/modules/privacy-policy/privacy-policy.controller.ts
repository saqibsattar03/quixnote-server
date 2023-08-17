import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PrivacyPolicyService } from './privacy-policy.service';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrivacyPolicyDto } from '../../data/dtos/privacyPolicy.dto';

@ApiTags('Privacy Policy')
@Controller('privacy-policy')
export class PrivacyPolicyController {
  constructor(private readonly privacyPolicyService: PrivacyPolicyService) {}

  @Post()
  @ApiBody({ type: PrivacyPolicyDto })
  create(@Body() data) {
    return this.privacyPolicyService.create(data);
  }

  @Get('/all')
  @ApiResponse({ type: [PrivacyPolicyDto] })
  getAll() {
    return this.privacyPolicyService.getAll();
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ type: PrivacyPolicyDto })
  getById(@Param('id') id) {
    return this.privacyPolicyService.getById(id);
  }

  @Patch('/:id')
  @ApiParam({ type: String, name: 'id' })
  @ApiBody({ type: PrivacyPolicyDto })
  editPrivacyPolicy(@Param('id') id, @Body() data) {
    return this.privacyPolicyService.editPrivacyPolicy(id, data);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  deletePrivacyPolicy(@Param('id') id) {
    return this.privacyPolicyService.deletePrivacyPolicy(id);
  }
}
