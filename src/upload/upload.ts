import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Accept only image files
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});
