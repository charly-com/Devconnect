import express from "express";
import auth from "../../server/middleware/authMiddleware.js";
import {
  getTotalLikes,
  getTotalComments,
  getTotalPosts,
  getTotalUsers,
  getTotalSpamPosts,
  getSpamPosts,
  deleteSpamPost,
} from "../../server/controllers/adminControllers.js";

const router = express.Router();

router.get("/get_total_users", auth, getTotalUsers);
router.get("/get_total_posts", auth, getTotalPosts);
router.get("/get_total_comments", auth, getTotalComments);
router.get("/get_total_likes", auth, getTotalLikes);
router.get("/get_total_spam_posts", auth, getTotalSpamPosts);
router.get("/get_spam_posts", auth, getSpamPosts);
router.delete("/delete_spam_posts/:id", auth, deleteSpamPost);

export default router;
