import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwtAuth.guard';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data, @Request() request) {
    data.userId = request.user.userId;
    return this.notesService.createNotes(data);
  }

  @Get('/all-by-userid')
  @UseGuards(JwtAuthGuard)
  getAllNotesOfUser(@Request() request) {
    return this.notesService.getAllNotesOfUser(request.user.userId);
  }

  @Get('/all')
  allNotes() {
    return this.notesService.allNotes();
  }

  @Get('/:id')
  getSingleNoteOfUser(@Param('id') id) {
    return this.notesService.getSingleNoteOfUser(id);
  }

  @Patch()
  editNote(@Body() data) {
    return this.notesService.editNote(data);
  }
}
