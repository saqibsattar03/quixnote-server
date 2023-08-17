import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ticket, TicketDocument } from '../../data/schemas/ticket.schema';
import { Model } from 'mongoose';
import { TicketDto } from '../../data/dtos/ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  async create(ticketDto: TicketDto): Promise<TicketDocument> {
    return this.ticketModel.create(ticketDto);
  }

  async getAllTicketsByUserId(userId): Promise<TicketDocument[]> {
    return this.ticketModel.find({ userId: userId });
  }

  async getSingleTicket(ticketId): Promise<TicketDocument> {
    return this.ticketModel.findById(ticketId);
  }

  async editTicket(data): Promise<TicketDocument> {
    const ticket = await this.ticketModel.findById(data.id);
    if (!ticket) throw new NotFoundException('no ticked found');
    return this.ticketModel.findByIdAndUpdate(
      data.id,
      {
        problem: data.problem,
        media: data.media,
      },
      { new: true },
    );
  }

  async deleteTicket(id): Promise<any> {
    const ticket = await this.ticketModel.findById(id);
    if (!ticket) throw new NotFoundException('no such ticked found');
    await this.ticketModel.findByIdAndDelete(id);
    throw new HttpException('ticket deleted successfully', HttpStatus.OK);
  }
}
