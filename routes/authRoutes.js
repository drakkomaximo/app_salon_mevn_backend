import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  register,
  verify,
  login,
  user,
  admin,
  verifyPasswordResetToken,
  forgotPassword,
  newPassword,
} from "../controllers/authControllers.js";

const router = express.Router();

router.get("/verify/:token", verify);
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router
  .route("/forgot-password/:token")
  .get(verifyPasswordResetToken)
  .post(newPassword);

// Private routes
router.get("/user", authMiddleware, user);
router.get("/admin", authMiddleware, admin);

export default router;
