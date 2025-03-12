import { Router } from "express";
import ConversationController from "./conversation.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

router.post("/addMessage", authMiddleware, ConversationController.addMessage);
router.get("/get/:childId/:deviceId", authMiddleware, ConversationController.getConversation);
router.get("/getAll", authMiddleware, ConversationController.getAllConversations);
router.delete("/delete/:conversationId", authMiddleware, ConversationController.deleteConversation);

export default router;
