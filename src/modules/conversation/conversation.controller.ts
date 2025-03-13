import { Request, Response } from "express";
import ConversationService from "./conversation.service";
import { AuthRequest } from "../../middleware/auth.middleware"; // ✅ AuthRequest tipini import et

class ConversationController {
  // 📌 **Yeni mesaj ekle (kullanıcı veya AI)**
  public async addMessage(req: Request, res: Response): Promise<void> {
    try {
      const { userId, deviceId, sender, text } = req.body;

      if (!userId || !deviceId || !sender || !text) {
        res.status(400).json({ message: "Eksik veri: userId, deviceId, sender ve text zorunludur." });
        return;
      }

      const conversation = await ConversationService.addMessage(userId, deviceId, sender, text);
      res.status(200).json({ message: "Mesaj kaydedildi", conversation });
    } catch (error) {
      console.error("❌ Mesaj ekleme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }

  // 📌 **Belirli bir kullanıcının konuşmasını getir**
  public async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { userId, deviceId } = req.params;
      const conversation = await ConversationService.getConversation(userId, deviceId);

      if (!conversation) {
        res.status(404).json({ message: "Konuşma bulunamadı." });
        return;
      }

      res.status(200).json(conversation);
    } catch (error) {
      console.error("❌ Konuşma getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }

  // 📌 **Tüm konuşmaları getir (ebeveyn için)**
  public async getAllConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Yetkilendirme başarısız. Kullanıcı bilgisi alınamadı." });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: "Kullanıcı ID'si gereklidir." });
        return;
      }

      const conversations = await ConversationService.getAllConversations(userId);
      res.status(200).json(conversations);
    } catch (error) {
      console.error("❌ Konuşmalar getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }

  // 📌 **Belirli bir konuşmayı sil**
  public async deleteConversation(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      await ConversationService.deleteConversation(conversationId);
      res.status(200).json({ message: "Konuşma silindi." });
    } catch (error) {
      console.error("❌ Konuşma silme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }
}

export default new ConversationController();
