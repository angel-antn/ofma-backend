import { FileInterceptor } from '@nestjs/platform-express';
import { imageFilter } from '../helpers/image_filter.helper';
import { diskStorage } from 'multer';

export const imageInterceptor = (dest: string) =>
  FileInterceptor('image', {
    fileFilter: imageFilter,
    limits: { fileSize: 2000000 },
    storage: diskStorage({
      destination: `./uploads/${dest}`,
    }),
  });
