import { Request, Response } from "express";
import ConversationService from "./conversation.service";
import { AuthRequest } from "../../middleware/auth.middleware"; // ✅ AuthRequest tipini import et

class ConversationController {
  // 📌 **Yeni mesaj ekle (çocuk veya AI)**
  public async addMessage(req: Request, res: Response):Promise<void> {
    try {
      const { childId, deviceId, sender, text } = req.body;

      if (!childId || !deviceId || !sender || !text) {
         res.status(400).json({ message: "Eksik veri: childId, deviceId, sender ve text zorunludur." });
      }

      const conversation = await ConversationService.addMessage(childId, deviceId, sender, text);
      res.status(200).json({ message: "Mesaj kaydedildi", conversation });
    } catch (error) {
      console.error("❌ Mesaj ekleme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }

  // 📌 **Belirli bir çocuğa ait konuşmayı getir**
  public async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { childId, deviceId } = req.params;
      const conversation = await ConversationService.getConversation(childId, deviceId);

      if (!conversation) {
         res.status(404).json({ message: "Konuşma bulunamadı." });
      }

      res.status(200).json(conversation);
    } catch (error) {
      console.error("❌ Konuşma getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  }

  // 📌 **Tüm konuşmaları getir (ebeveyn için)**
  public async getAllConversations(req: AuthRequest, res: Response): Promise<void> { // ✅ Request yerine AuthRequest kullanıldı
    try {
      if (!req.user) {
         res.status(401).json({ message: "Yetkilendirme başarısız. Kullanıcı bilgisi alınamadı." });
      }

      const parentId = req.user?.id; 
      if (!parentId) {
        res.status(400).json({ message: "Parent ID is required." });
        return;
      }
      const conversations = await ConversationService.getAllConversations(parentId);
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
