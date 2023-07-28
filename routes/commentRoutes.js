import express from "express";
import auth from "../../server/middleware/authMiddleware.js";
import {
    createComment,
    updateComment,
    likeComment,
    unLikeComment,
    deleteComment
  } from "../../server/controllers/commentControllers.js";

  const router = express.Router();


  router.post('/comment', auth, createComment);

  router.patch('/comment/:id', auth, updateComment);
  
  router.patch("/comment/:id/like", auth, likeComment);
  router.patch("/comment/:id/unlike", auth, unLikeComment);
  router.delete("/comment/:id", auth, deleteComment);



  export default router;