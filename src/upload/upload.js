"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
exports.upload = (0, multer_1.default)({
    dest: "uploads/",
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"));
        }
        cb(null, true);
    },
});
