import { DeviceModel, IDevice } from "./device.model";

class DeviceService {
  // Yeni cihaz oluştur
  public async createDevice(deviceData: Partial<IDevice>) {
    try {
      const newDevice = await DeviceModel.create(deviceData);
      return { success: true, device: newDevice };
    } catch (error) {
      console.error("Cihaz oluşturma hatası:", error);
      return { success: false, message: "Cihaz oluşturulamadı." };
    }
  }

  // Tüm cihazları getir
  public async getAllDevices() {
    try {
      const devices = await DeviceModel.find().populate("owner assignedChild", "name email");
      return { success: true, devices };
    } catch (error) {
      console.error("Cihazları getirme hatası:", error);
      return { success: false, message: "Cihazlar getirilemedi." };
    }
  }

  // Belirli bir cihazı ID ile getir
  public async getDeviceById(deviceId: string) {
    try {
      const device = await DeviceModel.findById(deviceId).populate("owner assignedChild", "name email");
      if (!device) return { success: false, message: "Cihaz bulunamadı." };
      return { success: true, device };
    } catch (error) {
      console.error("Cihaz getirme hatası:", error);
      return { success: false, message: "Cihaz getirilemedi." };
    }
  }

  // Cihaz güncelle
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

  
  async updateDeviceStatus(deviceId: string, data: Partial<{ status: string; battery: number }>) {
    return await DeviceModel.findByIdAndUpdate(deviceId, data, { new: true });
  }

  // Cihazı sil
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
