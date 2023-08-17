import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type NotesDocument = HydratedDocument<Notes>;
@Schema({ timestamps: true })
export class Notes {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;

  @Prop({ type: String })
  projectName: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  priority: string;

  @Prop({
    type: [String],
    required: [true, 'at least one timeline image is required'],
  })
  media: string[];

  @Prop({ type: String })
  deadline: string;
}

export const NotesSchema = SchemaFactory.createForClass(Notes);
