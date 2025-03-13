import { Schema, model, Document } from "mongoose";

export interface IMessage {
  sender: "user" | "ai";
  text: string; // Mesaj içeriği
  timestamp: Date; // Mesajın zamanı
}

export interface IConversation extends Document {
  userId: Schema.Types.ObjectId; 
  deviceId: Schema.Types.ObjectId; // Cihaz ID'si
  messages: IMessage[]; // Konuşma mesajları dizisi
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ["user", "ai"], required: true }, 
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<IConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    deviceId: { type: Schema.Types.ObjectId, ref: "Device", required: true },
    messages: [MessageSchema], // Mesajları bir dizi olarak saklıyoruz
  },
  { timestamps: true }
);

export const ConversationModel = model<IConversation>("Conversation", ConversationSchema);
