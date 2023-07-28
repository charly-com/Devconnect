import express from "express";
import dbConnect from "./db.js";
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import logger from 'morgan';
import { errorHandler, routeNotFound } from "../server/middleware/errorMiddleware.js";
import userRoutes from "../server/routes/userRoutes.js";
import postRoutes from "../server/routes/postRoutes.js";
import notifyRouter from "../server/routes/notificationRoutes.js";
import commentRouter from "../server/routes/commentRoutes.js";
import authRoutes from "../server/routes/authRoutes.js";
import adminRoutes from "../server/routes/adminRoutes.js";
import chatRoutes from "../server/routes/chatRoutes.js";
import messageRoutes from "../server/routes/messageRoutes.js";

dotenv.config();

dbConnect();
const app = express();
app.use(express.json());
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }));
app.use(cors());


// Main routes
app.use("/api", userRoutes);
app.use('/api', authRoutes);
app.use("/api", postRoutes);
app.use('/api', notifyRouter);
app.use('api', commentRouter);
app.use('/api', adminRoutes);
app.use("/api", chatRoutes);
app.use("/api", messageRoutes);

// Error handling routes
app.use(routeNotFound);
app.use(errorHandler);


const server = app.listen(process.env.PORT || 5000, () => {
  console.log(
    colors.brightMagenta(`\nServer is UP on PORT ${process.env.PORT}`)
  );
  console.log(`Visit  ` + colors.underline.blue(`localhost:${5000}`));
});
