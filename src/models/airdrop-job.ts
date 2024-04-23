import mongoose, { Document, Schema } from "mongoose";

export interface IAirdropJob extends Document {
  redeemCode: string;
  redeemed: boolean;
  quantity: number;
  recipient: string;
  contractAddress: string;
  createdAt: Date;
  updatedAt: Date;
  redeemAt?: Date;
}

const AirdropJobSchema: Schema = new Schema<IAirdropJob>({
  redeemCode: { type: String, required: true, unique: true },
  redeemed: { type: Boolean, default: false },
  quantity: { type: Number, required: true },
  recipient: { type: String, required: true, length: 42 },
  contractAddress: { type: String, required: true, length: 42 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  redeemAt: { type: Date, required: false },
});

export const AirdropJob = mongoose.model<IAirdropJob>(
  "AirdropJob",
  AirdropJobSchema
);
