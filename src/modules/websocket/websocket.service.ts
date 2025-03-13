import DeviceService from "../devices/device.service";


class WebSocketService {
    async processDeviceData(data: any) {
        try {
          // `data.data` içindeki bilgileri al
          const { deviceId, status, battery, sender, text, childId } = data.data || {};
      
          if (!deviceId) {
            console.error("❌ Eksik veri: deviceId gereklidir.");
            return;
          }
      
          // Cihazın durumu güncelleniyor
          await DeviceService.updateDevice(deviceId, { status, batteryLevel: battery });

      
          console.log(`📡 Cihaz verisi güncellendi: ${deviceId}`);
          
        } catch (error) {
          console.error("❌ WebSocket veri işleme hatası:", error);
        }
      }
}

export default new WebSocketService();
