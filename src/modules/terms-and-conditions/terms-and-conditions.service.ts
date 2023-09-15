import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Terms, TermsDocument } from '../../data/schemas/term.schema';
import { TermsAndConditionsDto } from '../../data/dtos/termsAndConditions.dto';

@Injectable()
export class TermsAndConditionsService {
  constructor(
    @InjectModel(Terms.name)
    private readonly termsModel: Model<TermsDocument>,
  ) {}

  async create(
    termsAndConditionsDto: TermsAndConditionsDto,
  ): Promise<TermsDocument> {
    return this.termsModel.create({
      clause: termsAndConditionsDto.clause,
      description: termsAndConditionsDto.description,
      lastUpdated: Date.now(),
    });
  }
  async getAll(): Promise<TermsDocument[]> {
    return this.termsModel.find().sort({ lastUpdated: -1 });
  }

  async getById(id): Promise<TermsDocument> {
    return this.termsModel.findById(id);
  }

  async editTermsAndConditions(
    id,
    termsAndConditionsDto: TermsAndConditionsDto,
  ): Promise<TermsDocument> {
    console.log(id);
    const response = await this.termsModel.findOne({
      _id: id,
    });
    if (!response) throw new NotFoundException('no document found');
    return this.termsModel.findByIdAndUpdate(
      id,
      {
        clause: termsAndConditionsDto.clause,
        description: termsAndConditionsDto.description,
      },
      { new: true },
    );
  }

  async deleteTermsAndConditions(id): Promise<any> {
    return this.termsModel.findByIdAndDelete(id);
  }
}
