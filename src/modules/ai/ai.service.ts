import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { SpeechClient, protos as speechProtos } from "@google-cloud/speech";
import { TextToSpeechClient, protos as ttsProtos } from "@google-cloud/text-to-speech";
import OpenAI from "openai";
import { UserProfileModel } from "../user_profiles/user_profiles.model";
import { DeviceModel } from "../devices/device.model";
import ConversationService from "../conversation/conversation.service"; // ✅ Konuşma servisi

// 🔹 Google Cloud istemcileri
const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

// 🔹 OpenAI API istemcisi
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  
  // 📌 **Ses dosyasını metne çevirme (Speech-to-Text - STT)**
  async speechToText(audioFilePath: string): Promise<string> {
    try {
      const sampleRateHertz: number = await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(audioFilePath, (err, metadata) => {
          if (err) reject(err);
          const sampleRate = metadata.streams[0]?.sample_rate;
          resolve(sampleRate || 16000);
        });
      });

      console.log(`🎙️ Ses örnekleme hızı: ${sampleRateHertz} Hz`);

      const audioBuffer = fs.readFileSync(audioFilePath);
      const audioBytes = audioBuffer.toString("base64");

      const request: speechProtos.google.cloud.speech.v1.IRecognizeRequest = {
        audio: { content: audioBytes },
        config: {
          encoding: speechProtos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
          sampleRateHertz,
          languageCode: "tr-TR",
        },
      };

      const response = await speechClient.recognize(request);
      const transcription = response[0]?.results
        ?.map(result => result.alternatives?.[0]?.transcript || "")
        .join(" ");

      console.log("🎙️ Ses metne dönüştürüldü:", transcription);
      return transcription || "Metin çıkarılamadı.";
    } catch (error) {
      console.error("❌ STT hatası:", error);
      throw new Error("Ses metne dönüştürülürken hata oluştu.");
    }
  }

  // 📌 **AI'ye mesaj gönder ve yanıt al (kişiselleştirilmiş)**
  async askAI(text: string, userId: string): Promise<string> {
    try {
      const userProfile = await UserProfileModel.findById(userId);

      let promptOptions = "Sen bir yardımcı AI'sin.";
      if (userProfile) {
        const { name, age, preferredVoice, interactionStyle } = userProfile;
        promptOptions = `Sen ${interactionStyle} bir kişiliğe sahip AI'sin. ${name} isimli kullanıcı seninle konuşuyor. ${age} yaşında. Ona uygun şekilde cevap ver.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: promptOptions },
          { role: "user", content: text },
        ],
      });

      return response.choices[0]?.message?.content || "Yanıt alınamadı.";
    } catch (error) {
      console.error("❌ OpenAI Hatası:", error);
      return "⚠️ AI şu anda yanıt veremiyor, lütfen daha sonra tekrar deneyin.";
    }
  }

  // 📌 **Yanıtı sese çevirme (Text-to-Speech - TTS)**
  async textToSpeech(text: string, outputPath: string, userId: string): Promise<string> {
    try {
      const userProfile = await UserProfileModel.findById(userId);

      let voiceName = "tr-TR-Wavenet-D"; // Varsayılan: Kız çocuk sesi
      if (userProfile?.preferredVoice === "child_male") {
        voiceName = "tr-TR-Wavenet-B"; // Erkek çocuk sesi
      }

      const ssmlText = `<speak><prosody rate="fast">${text}</prosody></speak>`;

      const request: ttsProtos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { ssml: ssmlText },
        voice: { languageCode: "tr-TR", name: voiceName },
        audioConfig: { audioEncoding: ttsProtos.google.cloud.texttospeech.v1.AudioEncoding.MP3 },
      };

      const response = await ttsClient.synthesizeSpeech(request);
      const audioContent = response[0]?.audioContent;
      if (!audioContent) throw new Error("Ses üretilemedi.");

      fs.writeFileSync(outputPath, audioContent);
      return outputPath;
    } catch (error) {
      console.error("❌ TTS hatası:", error);
      throw new Error("Metin sese dönüştürülürken hata oluştu.");
    }
  }

  // 📌 **AI yanıtını konuşma geçmişine kaydetme**
  async processConversation(userId: string, deviceId: string, text: string): Promise<string> {
    try {
      // 📌 1️⃣ **Cihazın bağlı olup olmadığını kontrol et**
      const device = await DeviceModel.findById(deviceId);
      if (!device || device.status !== "online") {
        throw new Error("Cihaz bağlı değil!");
      }

      // 📌 2️⃣ **AI'den yanıt al**
      const aiResponse = await this.askAI(text, userId);

      // 📌 3️⃣ **Konuşma geçmişine kaydet**
      await ConversationService.addMessage(userId, deviceId, "child", text); // Kullanıcının mesajı
      await ConversationService.addMessage(userId, deviceId, "ai", aiResponse); // AI yanıtı

      console.log("✅ Konuşma başarıyla kaydedildi.");

      return aiResponse;
    } catch (error) {
      console.error("❌ Konuşma işleme hatası:", error);
      throw new Error("Konuşma işlenirken hata oluştu.");
    }
  }
}

export default new AIService();
