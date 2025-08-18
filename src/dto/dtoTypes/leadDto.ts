import mongoose from "mongoose";

export interface LeadDto{
id:mongoose.Types.ObjectId,
name: string,
phoneNumber: string,
leadType?: number,
assignedAgent?: mongoose.Types.ObjectId,
assignedAgent_id?: mongoose.Types.ObjectId,
assignedAgent_name ?: string,
cost?: number,
priority?: number,
address?: string,
remarks?: string,
leadSource?: number,
category?: string | number,
status: number,
referredBy ?: string,
createdAt: string,
updatedAt: string,
createdBy?:mongoose.Types.ObjectId
createdById: mongoose.Types.ObjectId | string
createdByName: string
}