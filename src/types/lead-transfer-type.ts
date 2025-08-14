import mongoose from "mongoose";
import { LeadBasicType } from "./leadTypes";

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

 export interface TransferResponseType{
  transfers:TransferFetchType[],
  totalRecords: number
}

export interface TransferFetchType{
  _id:mongoose.Types.ObjectId
leadId: mongoose.Types.ObjectId
fromStaff: mongoose.Types.ObjectId
toStaff: mongoose.Types.ObjectId
transferDate: Date
leadData : LeadBasicType
fromStaffData: LeadBasicType
toStaffData : LeadBasicType
}