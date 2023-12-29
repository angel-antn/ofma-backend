import { Request } from 'express';

export const videoFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file) return callback(null, true);
  if ('mp4' === file.mimetype.split('/')[1]) return callback(null, true);
  return callback(null, false);
};
