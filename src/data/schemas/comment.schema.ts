import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Notes } from './note.schema';

export type CommentDocument = HydratedDocument<Comment>;
@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Notes.name })
  noteId: Notes;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: [String] })
  media: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
