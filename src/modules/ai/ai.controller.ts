import { Request, Response } from "express";
import AIService from "./ai.service";
import AIUtils from "./ai.utils";
import path from "path";
import ConversationService from "../conversation/conversation.service";
import { DeviceModel } from "../devices/device.model";
import { UserProfileModel } from "../user_profiles/user_profiles.model";

class AIController {
  async processAudio(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "Ses dosyası gereklidir" });
        return;
      }

      const { childId, deviceId } = req.body;

      if (!childId || !deviceId) {
        res.status(400).json({ message: "childId ve deviceId zorunludur." });
        return;
      }

      // **Cihazın ve çocuğun var olup olmadığını kontrol et**
      const device = await DeviceModel.findById(deviceId);
      const child = await UserProfileModel.findById(childId);
      if (!device || !child) {
        res.status(404).json({ message: "Cihaz veya çocuk bulunamadı." });
        return;
      }

      const inputPath = req.file.path;
      const wavPath = path.join("uploads", AIUtils.generateFileName(".wav"));
      const outputAudioPath = path.join("uploads", AIUtils.generateFileName(".mp3"));

      await AIUtils.convertToWav(inputPath, wavPath);
      const text = await AIService.speechToText(wavPath);

      // **Konuşmayı veritabanına kaydet (Çocuk tarafından gönderildi)**
      await ConversationService.addMessage(childId, deviceId, "child", text);

      // **AI'den cevap al**
      const aiResponse = await AIService.askAI(text, childId);

      // **AI'nin yanıtını konuşma geçmişine kaydet**
      await ConversationService.addMessage(childId, deviceId, "ai", aiResponse);

      // **AI cevabını sese çevir**
      await AIService.textToSpeech(aiResponse, outputAudioPath, childId);

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
