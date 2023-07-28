import express from "express";
import auth from "../../server/middleware/authMiddleware.js";
import { upload } from '../cloudinary.js'
import {
    registerUser,
    loginUser,
    allUsers,
  } from "../../server/controllers/userControllers.js";
const router = express.Router();








export default router;