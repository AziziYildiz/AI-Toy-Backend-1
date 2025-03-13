import { Router } from "express";
import authRoutes from "./auth/auth.route";  
import userProfilesRoutes from "./user_profiles/user_profiles.router";
import deviceRoutes from "./devices/device.router";
import conversationRoutes from "./conversation/conversation.router";
import aiRoutes from "./ai/ai.router"; // AI modülü eklendi


const router = Router();

// Modüllerin rotaları
router.use("/auth", authRoutes);
router.use("/user_profiles", userProfilesRoutes);
router.use("/devices", deviceRoutes);
router.use("/conversations", conversationRoutes);
router.use("/ai", aiRoutes); // AI modülü eklendi

export default router;




