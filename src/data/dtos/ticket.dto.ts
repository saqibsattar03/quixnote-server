import { ApiProperty } from '@nestjs/swagger';

export class TicketDto {
  @ApiProperty({ type: String, name: '_id' })
  _id: string;

  @ApiProperty({ type: String, name: 'problem' })
  problem: string;

  @ApiProperty({ type: [String], name: 'media' })
  media: [string];
}
