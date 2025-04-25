import express from "express";
import { auth } from "#auth/auth.js";

const app = express();
const port = process.env.PORT ?? "9001";

app.get("/", auth);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
