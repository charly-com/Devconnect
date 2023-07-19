import express from "express";
import dbConnect from "./db.js";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";

dotenv.config();

dbConnect();
const app = express();
app.use(express.json());
app.use(cors());

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    colors.brightMagenta(`\nServer is UP on PORT ${process.env.PORT}`)
  );
  console.log(`Visit  ` + colors.underline.blue(`localhost:${5000}`));
});
