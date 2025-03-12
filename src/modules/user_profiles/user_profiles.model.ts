import { Schema, model, Document } from "mongoose";

export interface IUserProfile extends Document {
  name: string;
  email?: string;
  password?: string;
  role: "parent" | "child";
  parentId?: Schema.Types.ObjectId;
  age?: number;
  gender?: "male" | "female" | "other";
  preferredVoice?: "child_male" | "child_female" | "adult_male" | "adult_female";
  interactionStyle?: "friendly" | "educational" | "funny";
  energyLevel?: "calm" | "active";
  contentFilter?: "3-6" | "7-9" | "10-12";
  customInstructions?: string;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["parent", "child"], required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    preferredVoice: { type: String, enum: ["child_male", "child_female", "adult_male", "adult_female"] },
    interactionStyle: { type: String, enum: ["friendly", "educational", "funny"] },
    energyLevel: { type: String, enum: ["calm", "active"] },
    contentFilter: { type: String, enum: ["3-6", "7-9", "10-12"] },
    customInstructions: { type: String, default: "" },
  },
  { timestamps: true }
);

export const UserProfileModel = model<IUserProfile>("UserProfile", UserProfileSchema);
