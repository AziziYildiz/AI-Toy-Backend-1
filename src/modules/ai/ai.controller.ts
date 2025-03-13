import { Request, Response } from "express";
import AIService from "./ai.service";
import AIUtils from "./ai.utils";
import path from "path";
import ConversationService from "../conversation/conversation.service";
import { DeviceModel } from "../devices/device.model";

class AIController {
  async processAudio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "Ses dosyası gereklidir" });
        return;
      }

      const { userId, deviceId } = req.body;

      if (!userId || !deviceId) {
        res.status(400).json({ message: "userId ve deviceId zorunludur." });
        return;
      }

      // **Cihazın var olup olmadığını kontrol et**
      const device = await DeviceModel.findById(deviceId);
      if (!device) {
        res.status(404).json({ message: "Cihaz bulunamadı." });
        return;
      }

      const inputPath = req.file.path;
      const wavPath = path.join("uploads", AIUtils.generateFileName(".wav"));
      const outputAudioPath = path.join("uploads", AIUtils.generateFileName(".mp3"));

      await AIUtils.convertToWav(inputPath, wavPath);
      const text = await AIService.speechToText(wavPath);

      // **Konuşmayı veritabanına kaydet (Kullanıcı tarafından gönderildi)**
      await ConversationService.addMessage(userId, deviceId, "user", text);

      // **AI'den cevap al**
      const aiResponse = await AIService.askAI(text, userId);

      // **AI'nin yanıtını konuşma geçmişine kaydet**
      await ConversationService.addMessage(userId, deviceId, "ai", aiResponse);

      // **AI cevabını sese çevir**
      await AIService.textToSpeech(aiResponse, outputAudioPath, userId);

      console.log(`✅ AI yanıtı oluşturuldu ve sese çevrildi: ${outputAudioPath}`);

      // **Yanıtı ESP32 cihazına gönder**
      res.sendFile(outputAudioPath, { root: "." });

    } catch (error) {
      console.error("❌ AI İşleme Hatası:", error);
      res.status(500).json({ message: "İşlenirken hata oluştu" });
    }
  }
}

export default new AIController();
