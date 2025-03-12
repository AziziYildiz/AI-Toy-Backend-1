import { Schema, model, Document } from "mongoose";
import { IUserProfile } from "../user_profiles/user_profiles.model";

export interface IDevice extends Document {
  owner: Schema.Types.ObjectId | IUserProfile; // Ebeveyn ile bağlantılı
  name: string; // Cihaz adı
  macAddress: string; // Benzersiz cihaz MAC adresi
  status: "online" | "offline" | "sleep"; // Cihaz durumu
  batteryLevel: number; // Pil seviyesi (% olarak)
  assignedChild?: Schema.Types.ObjectId | IUserProfile; // Cihaz hangi çocuğa ait
  firmwareVersion: string; // OTA güncellemeleri için firmware bilgisi
}

const DeviceSchema = new Schema<IDevice>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "UserProfile", required: true },
    name: { type: String, required: true },
    macAddress: { type: String, required: true, unique: true },
    status: { type: String, enum: ["online", "offline", "sleep"], default: "offline" },
    batteryLevel: { type: Number, default: 100 },
    assignedChild: { type: Schema.Types.ObjectId, ref: "UserProfile" }, // Çocuk profiline bağlanıyor
    firmwareVersion: { type: String, default: "1.0.0" }, // OTA için
  },
  { timestamps: true }
);

export const DeviceModel = model<IDevice>("Device", DeviceSchema);
