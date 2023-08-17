import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notes, NotesSchema } from '../../data/schemas/note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notes.name,
        schema: NotesSchema,
      },
    ]),
  ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
