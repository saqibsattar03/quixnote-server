import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FaqDto {
  @ApiProperty({ type: String, name: 'question' })
  @IsNotEmpty()
  question: string;

  @ApiProperty({ type: String, name: 'answer' })
  @IsNotEmpty()
  answer: string;
}
