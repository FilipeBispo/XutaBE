import "dotenv/config";
import express, { Request, Response } from "express";
import { auth, drive } from "./auth/auth.js";
import { upload } from "./upload/upload.js";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT ?? "9001";

// Endpoint to ping the server
app.get(
  "/ping",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  },
  (req, res) => {
    res.send("pong");
  }
);
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
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Request file:", req.file);
      console.log("Request body:", req.body);

      if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
      }

      const { buffer, originalname, mimetype } = req.file;
      const customFilename = req.body.filename || originalname;
      console.log("File details:", {
        originalname,
        customFilename,
        mimetype,
        bufferSize: buffer?.length,
      });

      let finalBuffer = buffer;
      let finalMimetype = mimetype;

      if (mimetype.startsWith("image/")) {
        // Compress image using sharp
        finalBuffer = await sharp(buffer)
          .resize({ width: 1024 }) // Resize to width of 1024px
          .jpeg({ quality: 80 }) // Compress to 80% quality
          .toBuffer();
        finalMimetype = "image/jpeg";
      }

      const tempFilePath = path.join("./uploads", "temp_" + customFilename);
      fs.writeFileSync(tempFilePath, finalBuffer);

      let parent = "";
      switch (req.body.type) {
        case "campaign":
          parent = process.env.CAMPAIGN_FOLDER_ID!;
          break;
        case "institution":
          parent = process.env.INSTITUTION_FOLDER_ID!;
          break;
        default:
          parent = process.env.CAMPAIGN_FOLDER_ID!;
      }
      if (!mimetype.startsWith("image/")) {
        // Upload to Google Drive
        const fileMetadata = {
          name: customFilename,
          parents: [parent],
        };
        const media = {
          mimeType: finalMimetype,
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
      } else {
        const formData = new FormData();
        // Convert buffer to base64
        const base64Image = buffer.toString("base64");
        formData.append("image", base64Image);
        const endpoint =
          "https://api.imgbb.com/1/upload?key=162cf566f6050b01def37b12bc310e34";

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("data", data);
        res.status(200).json({ fileId: data.data.medium.url });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send("An error occurred while uploading the file.");
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
