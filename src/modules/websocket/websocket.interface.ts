export interface DeviceMessage {
    deviceId: string;
    status: "online" | "offline";
    battery: number;
    message?: string;
  }
  