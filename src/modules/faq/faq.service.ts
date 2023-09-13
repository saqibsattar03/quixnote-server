import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FAQ, FAQDocument } from '../../data/schemas/faq.schema';
import { Model } from 'mongoose';
import { FaqDto } from '../../data/dtos/faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(FAQ.name)
    private readonly faqModel: Model<FAQDocument>,
  ) {}

  async create(faqDto: FaqDto): Promise<FAQDocument> {
    return this.faqModel.create(faqDto);
  }

  async getAll(): Promise<FAQDocument[]> {
    return this.faqModel.find().sort({ createdAt: -1 });
  }

  async getById(id): Promise<FAQDocument> {
    return this.faqModel.findById(id);
  }

  async editFaq(id, faqDto: FaqDto): Promise<FAQDocument> {
    return this.faqModel.findByIdAndUpdate(
      id,
      {
        question: faqDto.question,
        answer: faqDto.answer,
      },
      { new: true },
    );
  }

  async deleteFaq(id): Promise<any> {
    return this.faqModel.findByIdAndDelete(id);
  }
}
