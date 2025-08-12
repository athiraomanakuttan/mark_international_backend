import mongoose from "mongoose";

export type LeadIdWithAgent = {
  _id: string;
  assignedAgent: string | null;
};

export interface LeadTransferType{
  leadId: mongoose.Types.ObjectId | string;
      fromStaff ?: mongoose.Types.ObjectId | string | null;
      toStaff ?: mongoose.Types.ObjectId | string;
      transferDate ?: Date;
}