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
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/auth/guards/jwtAuth.guard';
import { NotesDto } from '../../data/dtos/notes.dto';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiBearerAuth('access-token')
  @ApiBody({ type: NotesDto })
  @UseGuards(JwtAuthGuard)
  create(@Body() data: any, @Request() request: any) {
    data.userId = request.user.userId;
    console.log('userId :: ', data);
    return this.notesService.createNotes(data);
  }

  @Get('/all-by-userid')
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: [NotesDto] })
  @UseGuards(JwtAuthGuard)
  getAllNotesOfUser(@Request() request: any) {
    return this.notesService.getAllNotesOfUser(request.user.userId);
  }

  @Get('/all')
  @ApiResponse({ type: [NotesDto] })
  allNotes() {
    return this.notesService.allNotes();
  }

  @Get('/:id')
  @ApiParam({ type: String, name: 'id' })
  @ApiResponse({ type: NotesDto })
  getSingleNoteOfUser(@Param('id') id: string) {
    return this.notesService.getSingleNoteOfUser(id);
  }

  @Patch()
  @ApiBody({ type: NotesDto })
  @ApiResponse({ type: NotesDto })
  editNote(@Body() data: any) {
    return this.notesService.editNote(data);
  }

  @Post('/filter')
  filterNotes(@Body() data) {
    return this.notesService.filterNotes(data);
  }
}
