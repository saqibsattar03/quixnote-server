import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwtAuth.guard';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { TicketDto } from '../../data/dtos/ticket.dto';

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiBody({ type: TicketDto })
  @UseGuards(JwtAuthGuard)
  create(@Body() data, @Request() request) {
    data.userId = request.user.userId;
    return this.ticketService.create(data);
  }

  @Get('/all')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getAllTicketsByUserId(@Request() request) {
    return this.ticketService.getAllTicketsByUserId(request.user.userId);
  }

  @Get('/:id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  getSingleTicket(@Param('id') id) {
    return this.ticketService.getSingleTicket(id);
  }

  @Patch()
  editTicket(@Body() data) {
    return this.ticketService.editTicket(data);
  }

  @Delete('/:id')
  deleteTicket(@Param('id') id) {
    return this.ticketService.deleteTicket(id);
  }
}
