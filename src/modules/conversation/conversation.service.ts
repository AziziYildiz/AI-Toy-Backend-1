import { ConversationModel } from "./conversation.model";

class ConversationService {
  // 📌 **Mesaj ekle (çocuğun veya AI'nin mesajını kaydet)**
  async addMessage(childId: string, deviceId: string, sender: "child" | "ai", text: string) {
    try {
      // **Konuşmayı bul veya oluştur**
      let conversation = await ConversationModel.findOne({ childId, deviceId });

      if (!conversation) {
        conversation = await ConversationModel.create({ childId, deviceId, messages: [] });
      }

      // **Mesajı ekleyip kaydet**
      conversation.messages.push({ sender, text, timestamp: new Date() });
      await conversation.save();

      return conversation;
    } catch (error) {
      console.error("❌ Konuşma kaydetme hatası:", error);
      throw error;
    }
  }

  // 📌 **Belirli bir çocuğa ait konuşmayı getir**
  async getConversation(childId: string, deviceId: string) {
    try {
      return await ConversationModel.findOne({ childId, deviceId }).populate("childId").populate("deviceId");
    } catch (error) {
      console.error("❌ Konuşma getirme hatası:", error);
      throw error;
    }
  }

  // 📌 **Tüm konuşmaları getir (ebeveyn için)**
  async getAllConversations(parentId: string) {
    try {
      return await ConversationModel.find({}).populate("childId").populate("deviceId");
    } catch (error) {
      console.error("❌ Konuşmalar listelenirken hata oluştu:", error);
      throw error;
    }
  }

  // 📌 **Belirli bir konuşmayı sil**
  async deleteConversation(conversationId: string) {
    try {
      return await ConversationModel.findByIdAndDelete(conversationId);
    } catch (error) {
      console.error("❌ Konuşma silme hatası:", error);
      throw error;
    }
  }
}

export default new ConversationService();
