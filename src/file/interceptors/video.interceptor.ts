import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { videoFilter } from '../helpers/video_filter.helper';

export const videoInterceptor = (dest: string) =>
  FileInterceptor('video', {
    fileFilter: videoFilter,
    storage: diskStorage({
      destination: `./uploads/${dest}`,
    }),
  });
