import { Schema, model, Document } from "mongoose";
import { IBranch } from "../types/modelTypes";

const branchSchema = new Schema<IBranch & Document>({
  branchName: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  isActive: { type: Number, default: 1, enum: [0, 1, -1] },
}, {
  timestamps: true,
});

const Branch = model<IBranch & Document>("Branch", branchSchema);
export default Branch;