import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notes, NotesDocument } from '../../data/schemas/note.schema';
import { Model } from 'mongoose';
import { NotesDto } from '../../data/dtos/notes.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Notes.name) private readonly notesModel: Model<NotesDocument>,
  ) {}

  async createNotes(notesDto: NotesDto): Promise<NotesDocument> {
    return this.notesModel.create(notesDto);
  }

  async allNotes(): Promise<NotesDocument[]> {
    return this.notesModel.find();
  }
  async getAllNotesOfUser(userId): Promise<NotesDocument[]> {
    return this.notesModel.find({ userId: userId }).populate({
      path: 'userId',
      select: 'fullName',
    });
  }

  async getSingleNoteOfUser(id): Promise<NotesDocument> {
    const note = await this.notesModel.findById(id);
    if (!note) throw new NotFoundException('no such note found');
    return this.notesModel.findById(id).populate('userId');
  }

  async editNote(notesDto: NotesDto): Promise<NotesDocument> {
    const note = await this.notesModel.findById(notesDto._id);
    if (!note) throw new NotFoundException('no note found');
    return this.notesModel.findByIdAndUpdate(
      notesDto._id,
      {
        title: notesDto.title,
        description: notesDto.description,
        priority: notesDto.priority,
        projectName: notesDto.projectName,
        deadline: notesDto.deadline,
        media: notesDto.media,
      },
      { new: true },
    );
  }
}
