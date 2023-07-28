import express from "express";
import auth from "../../server/middleware/authMiddleware.js";
import {
  register,
  registerAdmin,
  changePassword,
  login,
  adminLogin,
  logout,
  generateAccessToken,
} from "../../server/controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/register_admin", registerAdmin);
router.post("/changePassword", auth, changePassword);

router.post("/login", login);
router.post("/admin_login", adminLogin);

router.post("/logout", logout);

router.post("/refresh_token", generateAccessToken);

export default router;
