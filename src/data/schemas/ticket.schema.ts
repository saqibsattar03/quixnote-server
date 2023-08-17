import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type TicketDocument = HydratedDocument<Ticket>;
@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;

  @Prop({ type: String })
  problem: string;

  @Prop({ type: [String] })
  media: [string];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
