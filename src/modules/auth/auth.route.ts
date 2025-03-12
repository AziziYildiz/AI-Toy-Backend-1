import { Router } from "express";
import AuthController from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh", AuthController.handleRefreshToken);
router.post("/logout", AuthController.logout);
router.get("/verify", authMiddleware, AuthController.verifyUser);

export default router;
