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
    console.log('called' + notesDto);
    return this.notesModel.create(notesDto);
  }

  async allNotes(): Promise<NotesDocument[]> {
    return this.notesModel.find().sort({ createdAt: -1 });
  }
  async getAllNotesOfUser(userId): Promise<any> {
    const notes = await this.notesModel
      .find({ userId: userId })
      .populate({
        path: 'userId',
        select: 'fullName',
      })
      .sort({ createdAt: -1 });

    return notes.map((note) => ({
      ...note.toObject(),
      fullName: note.userId.fullName,
      userId: undefined,
    }));
  }

  async getSingleNoteOfUser(id): Promise<NotesDocument> {
    const note = await this.notesModel.findById(id);
    if (!note) throw new NotFoundException('no such note found');
    return this.notesModel.findById(id).populate('userId');
  }

  async editNote(notesDto: NotesDto): Promise<NotesDocument> {
    // const note = await this.notesModel.findById(notesDto._id);
    // if (!note) throw new NotFoundException('no note found');
    return this.notesModel.findByIdAndUpdate(
      // notesDto._id,
      {
        title: notesDto.title,
        description: notesDto.description,
        priority: notesDto.priority,
        // projectName: notesDto.projectName,
        deadline: notesDto.deadline,
        media: notesDto.media,
      },
      { new: true },
    );
  }

  async filterNotes(data): Promise<NotesDocument[]> {
    const pipeline = [];
    if (data.projectName) {
      pipeline.push({
        $match: { projectName: data.projectName },
      });
    }
    if (data.priority) {
      pipeline.push({
        $match: { priority: data.priority },
      });
    }
    if (data.createdAt) {
      // Convert the createdAt value to a Date object
      const createdAtDate = new Date(data.createdAt);

      const nextDay = new Date(createdAtDate);
      nextDay.setDate(createdAtDate.getDate() + 1);

      pipeline.push({
        $match: {
          createdAt: {
            $gte: createdAtDate,
            $lt: nextDay,
          },
        },
      });
    }
    // if (data.createdAt) {
    //   // Convert the createdAt value to a Date object
    //   const createdAtDate = new Date(data.createdAt);
    //
    //   // Create a date range around the createdAt value (e.g., within the same day)
    //   const startOfDay = new Date(createdAtDate);
    //   startOfDay.setHours(0, 0, 0, 0);
    //
    //   const endOfDay = new Date(createdAtDate);
    //   endOfDay.setHours(23, 59, 59, 999);
    //
    //   // Match documents within the specified date range
    //   pipeline.push({
    //     $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } },
    //   });
    // }
    return this.notesModel.aggregate(pipeline);
  }
}
