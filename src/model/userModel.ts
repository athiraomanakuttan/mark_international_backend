import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/modelTypes";

const userSchema = new Schema<IUser & Document>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, unique: true },
  accessibleUsers: { type: String },
  staffImage: { type: Schema.Types.Mixed },
  openingBalance: { type: String },
  accessOfficialWhatsapp: { type: Boolean, default: false },
  accessPhoneCallLog: { type: Boolean, default: false },
  role: { type: String, enum: ["admin", "user"], required: true },
}, {
  timestamps: true,
});
const UserModel = model<IUser & Document>("User", userSchema);
export default UserModel;

