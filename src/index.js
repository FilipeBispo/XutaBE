"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth/auth");
const upload_1 = require("./upload/upload");
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : "9001";
// Endpoint to upload and compress image
app.post("/upload", upload_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded.");
            return;
        }
        const { buffer, originalname, mimetype } = req.file;
        // Compress image using sharp
        const compressedBuffer = yield (0, sharp_1.default)(buffer)
            .resize({ width: 1024 }) // Resize to width of 1024px
            .jpeg({ quality: 80 }) // Compress to 80% quality
            .toBuffer();
        // Create a temporary file to upload
        const tempFilePath = path_1.default.join(__dirname, "temp_" + originalname);
        fs_1.default.writeFileSync(tempFilePath, compressedBuffer);
        // Upload to Google Drive
        const fileMetadata = {
            name: originalname,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Optional: specify folder
        };
        const media = {
            mimeType: mimetype,
            body: fs_1.default.createReadStream(tempFilePath),
        };
        const response = yield auth_1.drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id",
        });
        // Delete the temporary file
        fs_1.default.unlinkSync(tempFilePath);
        res.status(200).json({ fileId: response.data.id });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).send("An error occurred while uploading the file.");
    }
}));
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
