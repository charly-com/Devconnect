import express from "express";
import auth from "../../server/middleware/authMiddleware.js";
import {
    createMessage,
    getConversations,
    getMessages
  } from "../../server/controllers/messageControllers.js";

const router = express.Router();

router.post("/message", auth, createMessage);

router.get("/conversations", auth, getConversations);

router.get("/message/:id", auth, getMessages);


export default router;