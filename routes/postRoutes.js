import express from "express";
import auth from "../../server/middleware/authMiddleware.js";

import {
  createPost,
  updatePost,
  getUserPosts,
  getFeedPosts,
  getPost,
  getSavedPosts,
  unsavePost,
  savePost,
  reportPost,
  deletePost,
  getPostDiscover,
  unlikePost,
  likePost,
} from "../../server/controllers/postControllers.js";

const router = express.Router();

router.route("/posts").post(auth, createPost).get(auth, getFeedPosts);

router
  .route("/post/:id")
  .patch(auth, updatePost)
  .get(auth, getPost)
  .delete(auth, deletePost);

router.patch("/post/:id/like", auth, likePost);
router.patch("/post/:id/unlike", auth, unlikePost);

router.patch("/post/:id/report", auth, reportPost);

router.get("/user_posts/:id", auth, getUserPosts);

router.get("/post_discover", auth, getPostDiscover);

router.patch("/savePost/:id", auth, savePost);
router.patch("/unSavePost/:id", auth, unsavePost);
router.get("/getSavePosts", auth, getSavedPosts);

export default router;
