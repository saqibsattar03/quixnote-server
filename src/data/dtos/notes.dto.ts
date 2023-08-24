import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NotesDto {
  @ApiProperty({ type: String, name: '_id' })
  _id: string;

  @ApiProperty({ type: String, name: 'title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: String, name: 'description' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: String, name: 'priority' })
  @IsNotEmpty()
  priority: string;

  @ApiProperty({ type: String, name: 'projectName' })
  @IsNotEmpty()
  projectName: string;

  @ApiProperty({ type: String, name: 'deadline' })
  @IsNotEmpty()
  deadline: string;

  @ApiProperty({ type: [String], name: 'deadline' })
  media: [string];
}

export class NotesFilterDto {
  @ApiProperty({ type: String, name: 'projectName' })
  projectName: string;

  @ApiProperty({ type: String, name: 'priority' })
  priority: string;

  @ApiProperty({ type: Date, name: 'createdAt' })
  createdAt: Date;
}
