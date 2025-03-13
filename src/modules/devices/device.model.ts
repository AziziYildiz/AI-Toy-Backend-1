import { Schema, model, Document } from "mongoose";

// **DeviceConfig için ayrı bir interface oluştur**
export interface IDeviceConfig {
  name?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  preferredVoice?: "child_male" | "child_female" | "adult_male" | "adult_female";
  interactionStyle?: "friendly" | "educational" | "funny";
  energyLevel?: "calm" | "active";
  contentFilter?: "3-6" | "7-9" | "10-12";
  customInstructions?: string;
}

// **Device modeli için interface**
export interface IDevice extends Document {
  userId: Schema.Types.ObjectId;
  deviceName: string;
  serialNumber: string;
  wifiInfo?: {
    ssid: string;
    password: string;
  };
  status: "online" | "offline" | "sleep";
  batteryLevel: number;
  firmwareVersion: string;
  deviceConfig?: IDeviceConfig;
}

const DeviceConfigSchema = new Schema<IDeviceConfig>({
  name: { type: String, default: "" },
  age: { type: Number, default: null },
  gender: { type: String, enum: ["male", "female", "other"], default: "male" },
  preferredVoice: { type: String, enum: ["child_male", "child_female", "adult_male", "adult_female"], default: "child_male" },
  interactionStyle: { type: String, enum: ["friendly", "educational", "funny"], default: "friendly" },
  energyLevel: { type: String, enum: ["calm", "active"], default: "calm" },
  contentFilter: { type: String, enum: ["3-6", "7-9", "10-12"], default: "3-6" },
  customInstructions: { type: String, default: "" },
});

const DeviceSchema = new Schema<IDevice>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deviceName: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
    wifiInfo: {
      ssid: { type: String },
      password: { type: String },
    },
    status: { type: String, enum: ["online", "offline", "sleep"], default: "offline" },
    batteryLevel: { type: Number, default: 100 },
    firmwareVersion: { type: String, required: true },
    deviceConfig: { type: DeviceConfigSchema, required: false }, // 🔹 Opsiyonel hale getirildi
  },
  { timestamps: true }
);

export const DeviceModel = model<IDevice>("Device", DeviceSchema);
