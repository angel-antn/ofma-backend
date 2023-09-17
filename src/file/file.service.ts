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
}
