import express from "express";
import dbConnect from "./db.js";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import logger from 'morgan';
import { errorHandler, routeNotFound } from "../server/middleware/errorMiddleware.js";
import userRoutes from "../server/routes/userRoutes.js";

dotenv.config();

dbConnect();
const app = express();
app.use(express.json());
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Main routes
app.use("/api/users", userRoutes);

// Error handling routes
app.use(routeNotFound);
app.use(errorHandler);


const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    colors.brightMagenta(`\nServer is UP on PORT ${process.env.PORT}`)
  );
  console.log(`Visit  ` + colors.underline.blue(`localhost:${5000}`));
});
