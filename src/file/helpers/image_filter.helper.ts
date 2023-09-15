export const imageFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (!file) return callback(null, true);
  if (['webp', 'png', 'jpg', 'jpeg'].includes(file.mimetype.split('/')[1]))
    return callback(null, true);
  return callback(null, false);
};
