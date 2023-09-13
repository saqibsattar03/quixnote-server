import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ type: String, name: '_id' })
  _id: string;

  @ApiProperty({ type: String, name: 'userId' })
  userId: string;

  @ApiProperty({ type: String, name: 'noteId' })
  noteId: string;

  @ApiProperty({ type: String, name: 'comment' })
  comment: string;

  @ApiProperty({ type: String, name: 'media' })
  media: string;
}

export class EditCommentDto {
  @ApiProperty({ type: String, name: 'comment' })
  comment: string;

  @ApiProperty({ type: String, name: 'media' })
  media: string;
}
