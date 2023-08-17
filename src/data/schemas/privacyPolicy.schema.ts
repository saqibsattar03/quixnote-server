import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PrivacyPolicyDocument = HydratedDocument<PrivacyPolicy>;
@Schema({ timestamps: true })
export class PrivacyPolicy {
  @Prop({ type: String })
  clause: string;

  @Prop({ type: String })
  description: string;
}

export const PrivacyPolicySchema = SchemaFactory.createForClass(PrivacyPolicy);
