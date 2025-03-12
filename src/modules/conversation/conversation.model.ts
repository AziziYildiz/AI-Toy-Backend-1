import { Schema, model, Document } from "mongoose";

export interface IMessage {
  sender: "child" | "ai"; // Gönderen
  text: string; // Mesaj içeriği
  timestamp: Date; // Mesajın zamanı
}

export interface IConversation extends Document {
  childId: Schema.Types.ObjectId; // Çocuğun ID'si
  deviceId: Schema.Types.ObjectId; // Cihaz ID'si
  messages: IMessage[]; // Konuşma mesajları dizisi
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ["child", "ai"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<IConversation>(
  {
    childId: { type: Schema.Types.ObjectId, ref: "UserProfile", required: true },
    deviceId: { type: Schema.Types.ObjectId, ref: "Device", required: true },
    messages: [MessageSchema], // Mesajları bir dizi olarak saklıyoruz
  },
  { timestamps: true }
);

export const ConversationModel = model<IConversation>("Conversation", ConversationSchema);
