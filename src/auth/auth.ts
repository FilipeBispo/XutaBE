import { RequestHandler } from "express";
import { google } from "googleapis";

export const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

export const drive = google.drive({ version: "v3", auth });
