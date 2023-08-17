import { Module } from '@nestjs/common';
import { TermsAndConditionsController } from './terms-and-conditions.controller';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Terms, TermsSchema } from '../../data/schemas/term.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Terms.name,
        schema: TermsSchema,
      },
    ]),
  ],
  controllers: [TermsAndConditionsController],
  providers: [TermsAndConditionsService],
})
export class TermsAndConditionsModule {}
