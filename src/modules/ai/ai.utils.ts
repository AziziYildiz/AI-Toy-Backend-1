import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

class AIUtils {
  /**
   * 📌 **Dosya Silme:** İşlem tamamlandıktan sonra geçici dosyaları temizler.
   * @param filePath Silinecek dosyanın yolu
   */
  static async deleteFile(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Dosya zaten mevcut değil: ${filePath}`);
        resolve();
        return;
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`❌ Dosya silme hatası: ${filePath}`, err);
          reject(err);
        } else {
          console.log(`🗑️ Dosya başarıyla silindi: ${filePath}`);
          resolve();
        }
      });
    });
  }

  /**
   * 📌 **Ses Formatını WAV'e Dönüştürme:** AI için uygun ses formatına çevirir.
   * @param inputPath Kaynak ses dosyası
   * @param outputPath Dönüştürülen dosya yolu
   * @returns Dönüştürülen dosyanın yolu
   */
  static async convertToWav(inputPath: string, outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(inputPath)) {
        reject(new Error(`⚠️ Kaynak ses dosyası bulunamadı: ${inputPath}`));
        return;
      }

      ffmpeg(inputPath)
        .toFormat("wav")
        .on("end", () => {
          console.log(`✅ Ses başarıyla dönüştürüldü: ${outputPath}`);
          resolve(outputPath);
        })
        .on("error", (err) => {
          console.error(`❌ Ses dönüştürme hatası: ${err}`);
          reject(err);
        })
        .save(outputPath);
    });
  }

  /**
   * 📌 **Dosya Adı Oluşturucu:** Yüklenen her ses dosyası için benzersiz bir isim oluşturur.
   * @param extension Dosya uzantısı (örn. `.wav`, `.mp3`)
   * @returns Rastgele üretilmiş dosya adı
   */
  static generateFileName(extension: string): string {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}${extension}`;
  }

  /**
   * 📌 **Geçici Klasör Yönetimi:** `uploads/` klasörünün olup olmadığını kontrol eder, yoksa oluşturur.
   * @param folderPath Kontrol edilecek klasör yolu
   */
  static ensureFolderExists(folderPath: string): void {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Klasör başarıyla oluşturuldu: ${folderPath}`);
    }
  }

  /**
   * 📌 **Dosya Varlık Kontrolü:** Belirtilen dosyanın olup olmadığını kontrol eder.
   * @param filePath Kontrol edilecek dosya yolu
   * @returns {boolean} Dosya var mı? (true/false)
   */
  static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }
}

export default AIUtils;
