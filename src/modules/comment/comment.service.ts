import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from '../../data/schemas/comment.schema';
import { Model } from 'mongoose';
import { CommentDto } from '../../data/dtos/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  async createComment(commentDto: CommentDto): Promise<CommentDocument> {
    return this.commentModel.create(commentDto);
  }
  async getAllCommentByUser(userId: string): Promise<CommentDocument[]> {
    return this.commentModel.find({ userId: userId });
  }

  async getAllCommentsByNoteId(noteId): Promise<any> {
    const comments = await this.commentModel.find({ noteId: noteId }).populate({
      path: 'userId',
      select: 'fullName profileImage role',
    });
    return comments.map((comment) => ({
      ...comment.toObject(),
      fullName: comment.userId.fullName,
      profileImage: comment.userId.profileImage,
      role: comment.userId.role,
      userId: undefined,
    }));
  }
  async editComment(commentDto: CommentDto): Promise<CommentDocument> {
    const user = await this.commentModel.findOne({
      userId: commentDto.userId,
    });
    if (!user)
      throw new UnauthorizedException(
        'you are not allowed to edit this comment',
      );
    return this.commentModel.findOneAndUpdate(
      { _id: commentDto._id },
      {
        comment: commentDto.comment,
        media: commentDto.media,
      },
      { new: true },
    );
  }
  async deleteSingleComment(userId, commentId): Promise<any> {
    const authorizedUser = await this.commentModel.findOne({ userId: userId });
    if (!authorizedUser)
      throw new UnauthorizedException(
        'you are not allowed to delete this comment',
      );
    return this.commentModel.findByIdAndDelete(commentId);
  }
  async deleteNotesAllComments(noteId): Promise<any> {
    return this.commentModel.deleteMany({ noteId: noteId });
  }
  async deleteAllCommentByUser(userId): Promise<any> {
    return this.commentModel.deleteMany({ userId: userId });
  }
}
