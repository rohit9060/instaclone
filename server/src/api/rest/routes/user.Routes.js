import express from "express";
import { userController } from "../controllers/index.js";
import { AuthMiddleware, TokenMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/email/send", userController.sendEmailVerification);
router.post("/email/verify", TokenMiddleware, userController.verifyEmail);
router.post("/signin", userController.signIn);
router.get("/profile", AuthMiddleware, userController.profile);
router.post("/password/forgot", userController.forgotPassword);
router.post("/password/reset", TokenMiddleware, userController.resetPassword);
router.post("/password/change", TokenMiddleware, userController.changePassword);
router.get("/:username", userController.getUserByUsername);

export { router as userRoutes };
