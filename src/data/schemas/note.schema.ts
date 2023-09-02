import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type NotesDocument = HydratedDocument<Notes>;
@Schema({ timestamps: true })
export class Notes {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: User;

  // @Prop({ type: String })
  // projectName: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  priority: string;

  @Prop({
    type: String,
  })
  media: string;

  @Prop({ type: Date })
  deadline: Date;
}
export const NotesSchema = SchemaFactory.createForClass(Notes);
NotesSchema.pre('save', function (next) {
  if (this.isModified('priority')) {
    this.priority =
      this.priority.charAt(0).toUpperCase() + this.priority.slice(1);
  }
  next();
});
