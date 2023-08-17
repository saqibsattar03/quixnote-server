import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../../common/auth/guards/jwtAuth.guard';
import { CommentDto, EditCommentDto } from '../../data/dtos/comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CommentDto })
  @UseGuards(JwtAuthGuard)
  createComment(@Body() data, @Request() request) {
    data.userId = request.user.userId;
    return this.commentService.createComment(data);
  }

  @Patch()
  @ApiBearerAuth('access-token')
  @ApiBody({ type: EditCommentDto })
  @UseGuards(JwtAuthGuard)
  editComment(@Body() data, @Request() request) {
    data.userId = request.user.userId;
    return this.commentService.editComment(data);
  }

  @Get('/all')
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: [CommentDto] })
  @UseGuards(JwtAuthGuard)
  getAllCommentByUser(@Request() request) {
    return this.commentService.getAllCommentByUser(request.user.userId);
  }

  @Get('/all/:noteId')
  @ApiParam({ type: String, name: 'noteId' })
  @ApiResponse({ type: [CommentDto] })
  getAllCommentsByNoteId(@Param('noteId') noteId) {
    return this.commentService.getAllCommentsByNoteId(noteId);
  }

  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @ApiParam({ type: String, name: 'id' })
  @UseGuards(JwtAuthGuard)
  deleteSingleComment(@Request() request, @Param('id') id) {
    return this.commentService.deleteSingleComment(request.user.userId, id);
  }

  @Delete('/all-by-user')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  deleteAllCommentByUser(@Request() request) {
    return this.commentService.deleteAllCommentByUser(request.user.userId);
  }
}
