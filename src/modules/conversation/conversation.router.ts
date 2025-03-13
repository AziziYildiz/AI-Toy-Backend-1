import { Router } from "express";
import ConversationController from "./conversation.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// 📌 **Konuşmaya Yeni Mesaj Ekle**
router.post("/add-message", authMiddleware, ConversationController.addMessage);

// 📌 **Konuşmayı Getir**
router.get("/:userId/:deviceId", authMiddleware, ConversationController.getConversation);

// 📌 **Tüm konuşmaları getir (kullanıcıya ait)**
router.get("/getAll", authMiddleware, ConversationController.getAllConversations);

// 📌 **Konuşmayı Sil**
router.delete("/delete/:conversationId", authMiddleware, ConversationController.deleteConversation);

export default router;
