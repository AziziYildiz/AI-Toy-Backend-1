import { Request, Response } from "express";
import DeviceService from "./device.service";
import { IDeviceConfig } from "./device.model";

class DeviceController {
  // **Yeni cihaz oluşturma**
  public async createDevice(req: Request, res: Response): Promise<void> {
    try {
      const { userId, deviceName, serialNumber, wifiInfo, firmwareVersion } = req.body;

      if (!userId || !deviceName || !serialNumber || !firmwareVersion) {
        res.status(400).json({ message: "Tüm zorunlu alanları doldurun." });
        return;
      }

      const result = await DeviceService.createDevice({
        userId,
        deviceName,
        serialNumber,
        wifiInfo,
        firmwareVersion,
      });

      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error("Cihaz oluşturma hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // **Tüm cihazları getir**
  public async getAllDevices(req: Request, res: Response): Promise<void> {
    try {
      const result = await DeviceService.getAllDevices();
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihazları getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // **Belirli bir cihazı getir**
  public async getDeviceById(req: Request, res: Response): Promise<void> {
    try {
      const result = await DeviceService.getDeviceById(req.params.id);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihaz getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // **Cihaz bilgilerini güncelle**
  public async updateDevice(req: Request, res: Response): Promise<void> {
    try {
      const result = await DeviceService.updateDevice(req.params.id, req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihaz güncelleme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  public async updateDeviceConfig(req: Request, res: Response): Promise<void> {
    try {
      const { deviceId } = req.params; // URL'den cihaz ID'sini al
      const configData: IDeviceConfig = req.body; // Gönderilen veriyi al

      const result = await DeviceService.updateDeviceConfig(deviceId, configData);

      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihaz konfigürasyon güncelleme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // **Cihazı silme**
  public async deleteDevice(req: Request, res: Response): Promise<void> {
    try {
      const result = await DeviceService.deleteDevice(req.params.id);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihaz silme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }
}

export default new DeviceController();
