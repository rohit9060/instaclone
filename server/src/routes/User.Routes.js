import express from "express";
import { userController } from "../controllers/index.js";
import { AuthMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

router.get("/profile", AuthMiddleware, userController.profile);

export { router as userRoutes };
