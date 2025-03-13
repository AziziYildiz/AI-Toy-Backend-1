import { DeviceModel, IDevice, IDeviceConfig } from "./device.model";

class DeviceService {
  // **Yeni cihaz oluştur**
  public async createDevice(deviceData: Partial<IDevice>) {
    try {
      const newDevice = await DeviceModel.create(deviceData);
      return { success: true, device: newDevice };
    } catch (error) {
      console.error("Cihaz oluşturma hatası:", error);
      return { success: false, message: "Cihaz oluşturulamadı." };
    }
  }

  // **Tüm cihazları getir**
  public async getAllDevices() {
    try {
      const devices = await DeviceModel.find();
      return { success: true, devices };
    } catch (error) {
      console.error("Cihazları getirme hatası:", error);
      return { success: false, message: "Cihazlar getirilemedi." };
    }
  }

 
  // **Belirli bir cihazı ID ile getir**
  public async getDeviceById(deviceId: string) {
    try {
      const device = await DeviceModel.findById(deviceId);
      if (!device) return { success: false, message: "Cihaz bulunamadı." };
      return { success: true, device };
    } catch (error) {
      console.error("Cihaz getirme hatası:", error);
      return { success: false, message: "Cihaz getirilemedi." };
    }
  }

  // **Cihaz bilgilerini güncelle**
  public async updateDevice(deviceId: string, updateData: Partial<IDevice>) {
    try {
      const updatedDevice = await DeviceModel.findByIdAndUpdate(deviceId, updateData, { new: true });
      if (!updatedDevice) return { success: false, message: "Cihaz bulunamadı." };
      return { success: true, device: updatedDevice };
    } catch (error) {
      console.error("Cihaz güncelleme hatası:", error);
      return { success: false, message: "Cihaz güncellenemedi." };
    }
  }

  // **Cihazın `deviceConfig` ayarlarını güncelle**
    // 📌 Cihaz konfigürasyonunu güncelle
    public async updateDeviceConfig(deviceId: string, configData: IDeviceConfig) {
      try {
        const updatedDevice = await DeviceModel.findByIdAndUpdate(
          deviceId,
          { deviceConfig: configData }, // Yeni konfigürasyonu güncelle
          { new: true, runValidators: true }
        );
  
        if (!updatedDevice) return { success: false, message: "Cihaz bulunamadı." };
        return { success: true, device: updatedDevice };
      } catch (error) {
        console.error("Cihaz konfigürasyon güncelleme hatası:", error);
        return { success: false, message: "Cihaz konfigürasyonu güncellenemedi." };
      }
    }
  

  // **Cihaz silme**
  public async deleteDevice(deviceId: string) {
    try {
      const deletedDevice = await DeviceModel.findByIdAndDelete(deviceId);
      if (!deletedDevice) return { success: false, message: "Cihaz bulunamadı." };
      return { success: true, message: "Cihaz başarıyla silindi." };
    } catch (error) {
      console.error("Cihaz silme hatası:", error);
      return { success: false, message: "Cihaz silinemedi." };
    }
  }
}

export default new DeviceService();
