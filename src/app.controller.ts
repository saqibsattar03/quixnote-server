import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/single-file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        media: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: String, description: 'uploaded file name' })
  @ApiBadRequestResponse({ description: 'could not upload file' })
  @UseInterceptors(FileInterceptor('media'))
  async uploadProfileImage(
    @UploadedFile() media: Express.Multer.File,
  ): Promise<any> {
    if (media) {
      return media.filename;
    }
    throw new HttpException('no image uploaded', HttpStatus.NOT_FOUND);
  }

  @Delete('/remove-file')
  @ApiQuery({ name: 'media', type: String })
  async removeProfileImage(@Query('media') media, @Res() res): Promise<any> {
    if (media) {
      const filePath = path.join(__dirname, '..', '..', '/uploads/' + media);
      try {
        fs.unlink(filePath, (err) => {
          if (err)
            res.status(500).send({
              message: 'Could not delete the file. ' + err,
            });
          res.status(200).send({
            message: 'File is deleted.',
          });
        });
      } catch (e) {
        res.status(500).send({
          message: 'Could not delete the file. ' + e,
        });
      }
    } else throw new HttpException('file not selected', HttpStatus.BAD_REQUEST);
  }
}
