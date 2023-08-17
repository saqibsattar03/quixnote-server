import { Module } from '@nestjs/common';
import { PrivacyPolicyService } from './privacy-policy.service';
import { PrivacyPolicyController } from './privacy-policy.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PrivacyPolicy,
  PrivacyPolicySchema,
} from '../../data/schemas/privacyPolicy.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PrivacyPolicy.name,
        schema: PrivacyPolicySchema,
      },
    ]),
  ],
  providers: [PrivacyPolicyService],
  controllers: [PrivacyPolicyController],
})
export class PrivacyPolicyModule {}
