import { Request, Response } from "express";
import DeviceService from "./device.service";

class DeviceController {
  // Yeni cihaz oluşturma
  public async createDevice(req: Request, res: Response): Promise<void> {
    try {
      const { name, macAddress, owner, assignedChild, firmwareVersion } = req.body;

      if (!name || !macAddress || !owner) {
        res.status(400).json({ message: "Tüm zorunlu alanları doldurun." });
        return;
      }

      const result = await DeviceService.createDevice({
        name,
        macAddress,
        owner,
        assignedChild,
        firmwareVersion,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json(result);
    } catch (error) {
      console.error("Cihaz oluşturma hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Tüm cihazları getir
  public async getAllDevices(req: Request, res: Response): Promise<void> {
    try {
      const result = await DeviceService.getAllDevices();
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihazları getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Belirli bir cihazı getir
  public async getDeviceById(req: Request, res: Response): Promise<void> {
    try {
      const result = await DeviceService.getDeviceById(req.params.id);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihaz getirme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Cihaz güncelle
  public async updateDevice(req: Request, res: Response): Promise<void> {
    try {
      const result = await DeviceService.updateDevice(req.params.id, req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error("Cihaz güncelleme hatası:", error);
      res.status(500).json({ message: "Sunucu hatası." });
    }
  }

  // Cihaz silme
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
