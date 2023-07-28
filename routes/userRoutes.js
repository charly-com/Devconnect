import express from "express";
import auth from "../../server/middleware/authMiddleware.js";
import {
  searchUser,
  getUser,
  updateUser,
  follow,
  unfollow,
  suggestionsUser,
} from "../../server/controllers/userControllers.js";

const router = express.Router();

router.get('/search', auth, searchUser);

router.get('/user/:id', auth, getUser);

router.patch("/user", auth, updateUser);

router.patch("/user/:id/follow", auth, follow);
router.patch("/user/:id/unfollow", auth, unfollow);

router.get("/suggestionsUser", auth, suggestionsUser);





export default router;