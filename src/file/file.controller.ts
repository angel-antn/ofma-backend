import { Response } from 'express';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('musician/:fileName')
  findMusicianImage(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const path = this.fileService.findMusicianImage(fileName);
    response.sendFile(path);
  }

  @Get('concert/:fileName')
  findConcertImage(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const path = this.fileService.findConcertImage(fileName);
    response.sendFile(path);
  }

  @Get('exclusive-content/images/:fileName')
  findExclusiveContentImage(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const path = this.fileService.findExclusiveContentImage(fileName);
    response.sendFile(path);
  }

  @Get('exclusive-content/videos/:fileName')
  findExclusiveContentVideo(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const path = this.fileService.findExclusiveContentVideo(fileName);
    response.sendFile(path);
  }
}
