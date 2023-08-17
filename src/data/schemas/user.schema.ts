import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  fullName: string;

  @Prop({ type: String, lowercase: true, required: true, unique: true })
  email: string;

  @Prop({ type: String, select: false })
  password: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  state: string;

  @Prop({
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
    uppercase: true,
  })
  role: string;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'DELETED'],
    default: 'ACTIVE',
    uppercase: true,
  })
  status: string;

  @Prop({ type: [String] })
  scopes: [string];

  @Prop({ type: String })
  profileImage: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: Boolean, default: true })
  notificationPreference: boolean;

  @Prop({ type: Boolean, default: false })
  isSubscribed: boolean;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
