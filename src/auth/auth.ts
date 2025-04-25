import { RequestHandler } from "express";

export const auth: RequestHandler = (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
};
