"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drive = exports.auth = void 0;
const googleapis_1 = require("googleapis");
exports.auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
});
exports.drive = googleapis_1.google.drive({ version: "v3", auth: exports.auth });
