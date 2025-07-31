import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/modelTypes";

const userSchema = new Schema<IUser & Document>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: false },
  accessibleUsers: { type: [Number], default: [] },
  profilePic: { type: Schema.Types.Mixed },
  openingBalance: { type: Number, default: 0 },
  role: { type: String, enum: ["admin", "staff"], required: true, default: "staff" },
  isActive: { type: Boolean, default:1, enum: [0, 1, -1] },
}, {
  timestamps: true,
});
const User = model<IUser & Document>("User", userSchema);
export default User;

