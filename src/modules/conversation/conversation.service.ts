import { ConversationModel } from "./conversation.model";

class ConversationService {
  // 📌 **Mesaj ekle (kullanıcı veya AI mesajını kaydet)**
  async addMessage(userId: string, deviceId: string, sender: "user" | "ai", text: string) {
    try {
      // **Konuşmayı bul veya oluştur**
      let conversation = await ConversationModel.findOne({ userId, deviceId });

      if (!conversation) {
        conversation = await ConversationModel.create({ userId, deviceId, messages: [] });
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

  // 📌 **Belirli bir kullanıcının konuşmasını getir**
  async getConversation(userId: string, deviceId: string) {
    try {
      return await ConversationModel.findOne({ userId, deviceId }).populate("userId").populate("deviceId");
    } catch (error) {
      console.error("❌ Konuşma getirme hatası:", error);
      throw error;
    }
  }

  // 📌 **Tüm konuşmaları getir (ebeveyn için)**
  async getAllConversations(userId: string) {
    try {
      return await ConversationModel.find({ userId }).populate("userId").populate("deviceId");
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
