import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TermsAndConditionsDto {
  @ApiProperty({ type: String, name: '_id' })
  _id: string;

  @ApiProperty({ type: String, name: 'clause' })
  @IsNotEmpty()
  clause: string;

  @ApiProperty({ type: String, name: 'description' })
  @IsNotEmpty()
  description: string;
}
