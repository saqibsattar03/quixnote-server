import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FaqDto } from '../../data/dtos/faq.dto';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  @ApiBody({ type: FaqDto })
  create(@Body() data) {
    return this.faqService.create(data);
  }

  @Get('/all')
  @ApiResponse({ type: [FaqDto] })
  getAll() {
    return this.faqService.getAll();
  }

  @Get('/:id')
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ type: FaqDto })
  getById(@Param('id') id) {
    return this.faqService.getById(id);
  }

  @Patch('/:id')
  @ApiParam({ type: 'string', name: 'id' })
  @ApiBody({ type: FaqDto })
  editFaq(@Param('id') id, @Body() data) {
    return this.faqService.editFaq(id, data);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: String })
  deletePrivacyPolicy(@Param('id') id) {
    return this.faqService.deleteFaq(id);
  }
}
