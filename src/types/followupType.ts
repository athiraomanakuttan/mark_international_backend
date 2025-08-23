import mongoose from "mongoose";
import { StaffBasicType } from "./staffType";
import { LeadBasicType } from "./leadTypes";

export interface FollowUpType{
  leadId ?: string;
  followup_date: string
  isDeleted ?: boolean
  assignedAgentId ?: string
  remarks?: string
}

export interface FollowupResponseType{
  _id: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  followup_date: string;
  isDeleted: boolean;
  assignedAgentId ?: mongoose.Types.ObjectId;
  remarks ?: string;
  assignedAgentIdObj?: mongoose.Types.ObjectId;
  leadIdObj?: mongoose.Types.ObjectId;
  assignedAgent ?: StaffBasicType[];
  lead ?: LeadBasicType[];
}