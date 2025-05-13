import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB limit
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    // Accept only image files
    if (
      !file.mimetype.startsWith("image/") &&
      file.mimetype !== "application/pdf"
    ) {
      return cb(new Error("Only image files and PDFs are allowed!"));
    }
    cb(null, true);
  },
});
