import express from "express";
import { userController } from "../controllers/index.js";
import { AuthMiddleware, TokenMiddleware } from "../middlewares/index.js";
import { uploadHandler } from "../../../utils/index.js";

const router = express.Router();

// public routes
router.post("/signup", userController.signUp);
router.post("/email/send", userController.sendEmailVerification);
router.post("/email/verify", TokenMiddleware, userController.verifyEmail);
router.post("/signin", userController.signIn);
router.get("/:username", userController.getUserByUsername);

//! protected routes
// profile
router.get("/profile", AuthMiddleware, userController.getProfile);

router.patch("/profile", AuthMiddleware, userController.editProfile);
router.delete("/profile", AuthMiddleware, userController.deleteAccount);

router.post(
  "/profile/picture",
  AuthMiddleware,
  uploadHandler,
  userController.uploadProfilePicture
);
router.patch(
  "/profile/picture",
  AuthMiddleware,
  uploadHandler,
  userController.updateProfilePicture
);

router.delete(
  "/profile/picture",
  AuthMiddleware,
  userController.deleteProfilePicture
);

router.post("/password/forgot", userController.forgotPassword);
router.post("/password/reset", TokenMiddleware, userController.resetPassword);
router.post("/password/change", TokenMiddleware, userController.changePassword);

export { router as userRoutes };
