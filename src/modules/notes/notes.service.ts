import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notes, NotesDocument } from '../../data/schemas/note.schema';
import { Model } from 'mongoose';
import { NotesDto } from '../../data/dtos/notes.dto';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(Notes.name) private readonly notesModel: Model<NotesDocument>,
    private readonly commentService: CommentService,
  ) {}

  async createNotes(notesDto: NotesDto): Promise<NotesDocument> {
    // const localDeadline = new Date(notesDto.deadline); // Assuming notesDto.deadline is already a JavaScript Date object
    //
    // // Convert localDeadline to a string in ISO 8601 format with timezone offset
    // const isoStringWithOffset = localDeadline.toISOString();
    // const localDeadline = moment(notesDto.deadline).format(); // Assuming notesDto.deadline is already a JavaScript Date object
    //
    // const timezone = moment.tz.guess();

    const localDeadline = new Date(notesDto.deadline); // Assuming notesDto.deadline is already a JavaScript Date object

    const timezoneOffset = localDeadline.getTimezoneOffset(); // Get the timezone offset in minutes
    const timezoneOffsetMilliseconds = timezoneOffset * 60 * 1000; // Convert to milliseconds

    // Adjust the date by subtracting the timezone offset
    const localDeadlineAdjusted = new Date(
      localDeadline.getTime() - timezoneOffsetMilliseconds,
    );
    return this.notesModel.create({
      userId: notesDto.userId,
      title: notesDto.title,
      priority: notesDto.priority,
      description: notesDto.description,
      deadline: localDeadlineAdjusted,
      media: notesDto.media,
    });
  }

  async allNotes(): Promise<NotesDocument[]> {
    return this.notesModel.find().sort({ createdAt: -1 });
  }
  async getAllNotesOfUser(userId: any): Promise<any> {
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

  async getNoteById(id): Promise<NotesDocument> {
    const note = await this.notesModel.findById(id);
    if (!note) throw new NotFoundException('no such note found');
    return note;
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
    if (data.title) {
      pipeline.push({
        $match: {
          title: {
            $regex: data.title,
            $options: 'i',
          },
        },
      });
    }
    if (data.priority) {
      pipeline.push({
        $match: { priority: data.priority },
      });
    }
    if (data.createdAt) {
      const now = new Date();
      switch (data.createdAt) {
        case 'Today':
          const startOfDay = new Date(now);
          startOfDay.setHours(0, 0, 0, 0);
          const endOfDay = new Date(startOfDay);
          endOfDay.setDate(startOfDay.getDate() + 1);
          pipeline.push({
            $match: {
              createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
            },
          });
          break;
        case 'Last Week':
          const lastWeekStart = new Date(now);
          lastWeekStart.setDate(now.getDate() - 7); // Go back 7 days
          lastWeekStart.setHours(0, 0, 0, 0); // Set time to midnight
          pipeline.push({
            $match: {
              createdAt: {
                $gte: lastWeekStart,
                $lte: now,
              },
            },
          });
          break;

        case 'Last Month':
          const lastMonthStart = new Date(now);
          lastMonthStart.setMonth(now.getMonth() - 1); // Go back 1 month
          lastMonthStart.setDate(1); // Set to the first day of the month
          lastMonthStart.setHours(0, 0, 0, 0); // Set time to midnight

          const lastMonthEnd = new Date(now);
          lastMonthEnd.setDate(0); // Go back to the last day of the previous month
          lastMonthEnd.setHours(23, 59, 59, 999); // Set time to the last millisecond of the day

          pipeline.push({
            $match: {
              createdAt: {
                $gte: lastMonthStart,
                $lte: lastMonthEnd,
              },
            },
          });
          break;

        case 'Last Year':
          const lastYearStart = new Date(now);
          lastYearStart.setFullYear(now.getFullYear() - 1); // Go back 1 year
          lastYearStart.setMonth(0); // Set to the first month of the year
          lastYearStart.setDate(1); // Set to the first day of the month
          lastYearStart.setHours(0, 0, 0, 0); // Set time to midnight

          const lastYearEnd = new Date(now);
          lastYearEnd.setMonth(11); // Set to the last month of the year
          lastYearEnd.setDate(31); // Set to the last day of the month
          lastYearEnd.setHours(23, 59, 59, 999); // Set time to the last millisecond of the day
          pipeline.push({
            $match: {
              createdAt: {
                $gte: lastYearStart,
                $lte: lastYearEnd,
              },
            },
          });
          break;

        default:
          break;
      }

      // pipeline.push({
      //   $match: {
      //     createdAt: {
      //       $gte: createdAtDate,
      //       $lt: nextDay,
      //     },
      //   },
      // });
    }
    return this.notesModel.aggregate(pipeline);
  }

  async deleteNote(id): Promise<any> {
    await this.commentService.deleteNotesAllComments(id);
    const result = await this.notesModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('note not found');
    throw new HttpException('note deleted successfully', HttpStatus.OK);
  }
}
