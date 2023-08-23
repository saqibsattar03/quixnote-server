import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PrivacyPolicy,
  PrivacyPolicyDocument,
} from '../../data/schemas/privacyPolicy.schema';
import { Model } from 'mongoose';
import { PrivacyPolicyDto } from '../../data/dtos/privacyPolicy.dto';

@Injectable()
export class PrivacyPolicyService {
  constructor(
    @InjectModel(PrivacyPolicy.name)
    private readonly privacyPolicyModel: Model<PrivacyPolicyDocument>,
  ) {}

  async create(
    privacyPolicyDto: PrivacyPolicyDto,
  ): Promise<PrivacyPolicyDocument> {
    return this.privacyPolicyModel.create({
      clause: privacyPolicyDto.clause,
      description: privacyPolicyDto.description,
      lastUpdated: Date.now(),
    });
  }
  async getAll(): Promise<PrivacyPolicyDocument[]> {
    return this.privacyPolicyModel.find().sort({ lastUpdated: -1 });
  }

  async getById(id): Promise<PrivacyPolicyDocument> {
    return this.privacyPolicyModel.findById(id);
  }

  async editPrivacyPolicy(
    id,
    privacyPolicyDto: PrivacyPolicyDto,
  ): Promise<PrivacyPolicyDocument> {
    const response = await this.privacyPolicyModel.findById(id);
    if (!response) throw new NotFoundException('no document found');
    return this.privacyPolicyModel.findByIdAndUpdate(
      id,
      {
        clause: privacyPolicyDto.clause,
        description: privacyPolicyDto.description,
      },
      { new: true },
    );
  }

  async deletePrivacyPolicy(id): Promise<any> {
    return this.privacyPolicyModel.findByIdAndDelete(id);
  }
}
