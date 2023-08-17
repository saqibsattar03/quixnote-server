import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FAQ, FAQSchema } from '../../data/schemas/faq.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FAQ.name,
        schema: FAQSchema,
      },
    ]),
  ],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
