import express from "express";
import { userController } from "../controllers/index.js";

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);

export { router as userRoutes };
