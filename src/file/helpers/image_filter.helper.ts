import { Request } from 'express';

export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file) return callback(null, true);
  if ('webp' === file.mimetype.split('/')[1]) return callback(null, true);
  return callback(null, false);
};
