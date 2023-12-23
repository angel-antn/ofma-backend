import { join } from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FileService {
  findMusicianImage(fileName: string) {
    const path = join(__dirname, '../../uploads/musician', fileName);
    if (!existsSync(path)) throw new NotFoundException('image not found');
    return path;
  }

  findConcertImage(fileName: string) {
    const path = join(__dirname, '../../uploads/concert', fileName);
    if (!existsSync(path)) throw new NotFoundException('image not found');
    return path;
  }

  findExclusiveContentImage(fileName: string) {
    const path = join(
      __dirname,
      '../../uploads/exclusive-content/images',
      fileName,
    );
    if (!existsSync(path)) throw new NotFoundException('image not found');
    return path;
  }

  findExclusiveContentVideo(fileName: string) {
    const path = join(
      __dirname,
      '../../uploads/exclusive-content/videos',
      fileName,
    );
    if (!existsSync(path)) throw new NotFoundException('video not found');
    return path;
  }
}
