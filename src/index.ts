import "dotenv/config";
import express, { Request, Response } from "express";
import { auth, drive } from "./auth/auth.js";
import { upload } from "./upload/upload.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT ?? "9001";
// Endpoint to upload and compress image
app.post(
  "/upload",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  },
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Request file:", req.file);

      if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
      }

      const { buffer, originalname, mimetype } = req.file;
      console.log("File details:", {
        originalname,
        mimetype,
        bufferSize: buffer?.length,
      });

      // Compress image using sharp
      const compressedBuffer = await sharp(buffer)
        .resize({ width: 1024 }) // Resize to width of 1024px
        .jpeg({ quality: 80 }) // Compress to 80% quality
        .toBuffer();

      // Create a temporary file to upload
      const tempFilePath = path.join("./uploads", "temp_" + originalname);
      fs.writeFileSync(tempFilePath, compressedBuffer);

      // Upload to Google Drive
      const fileMetadata = {
        name: originalname,
        parents: [process.env.DRIVE_FOLDER_ID!], // Optional: specify folder
      };
      const media = {
        mimeType: mimetype,
        body: fs.createReadStream(tempFilePath),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      // Delete the temporary file
      fs.unlinkSync(tempFilePath);

      res.status(200).json({ fileId: response.data.id });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("An error occurred while uploading the file.");
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
