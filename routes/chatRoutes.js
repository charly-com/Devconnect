import express from "express";
import auth from "../../server/middleware/authMiddleware.js";
import {
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
  } from "../../server/controllers/chatControllers.js";

const router = express.Router();



router.route("/group").post(auth, createGroupChat);

router.route("/grouprename").put(auth, renameGroup);

router.route("/groupremove").put(auth, removeFromGroup);

router.route("/groupadd").put(auth, addToGroup);

export default router;
