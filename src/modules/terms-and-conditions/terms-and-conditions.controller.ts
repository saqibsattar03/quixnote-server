import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TermsAndConditionsDto } from '../../data/dtos/termsAndConditions.dto';

@ApiTags('Terms And Conditions')
@Controller('terms-and-conditions')
export class TermsAndConditionsController {
  constructor(
    private readonly termsAndConditionService: TermsAndConditionsService,
  ) {}

  @Post()
  @ApiBody({ type: TermsAndConditionsDto })
  create(@Body() data) {
    return this.termsAndConditionService.create(data);
  }

  @Get('/all')
  @ApiResponse({ type: [TermsAndConditionsDto] })
  getAll() {
    return this.termsAndConditionService.getAll();
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ type: TermsAndConditionsDto })
  getById(@Param('id') id) {
    return this.termsAndConditionService.getById(id);
  }

  @Patch('/:id')
  @ApiParam({ type: String, name: 'id' })
  @ApiBody({ type: TermsAndConditionsDto })
  editPrivacyPolicy(@Body() data, @Param('id') id) {
    return this.termsAndConditionService.editTermsAndConditions(id, data);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  deletePrivacyPolicy(@Param('id') id) {
    return this.termsAndConditionService.deleteTermsAndConditions(id);
  }
}
