import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TermsDocument = HydratedDocument<Terms>;
@Schema({ timestamps: true })
export class Terms {
  @Prop({ type: String })
  clause: string;

  @Prop({ type: String })
  description: string;
}

export const TermsSchema = SchemaFactory.createForClass(Terms);
