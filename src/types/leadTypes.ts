import mongoose from "mongoose"
import { UserAuthType } from "./authTypes"
import { IUser } from "./modelTypes"
export interface LeadBasicType{
    name: string,
phoneNumber: string,
leadType: number,
assignedAgent: mongoose.Types.ObjectId | string,
cost: number,
priority: number,
address?: string,
remarks?: string,
leadSource?: number,
category?: string,
status: number,
referredBy: string,
createdAt?: string,
updatedAt?: string,
createdBy :mongoose.Types.ObjectId | string
}

export interface LeadresponseType{
    totalRecords:number,
    lead:LeadType[]
    
}
export  interface LeadType    {
        _id: mongoose.Types.ObjectId,
    name:string,
    phoneNumber: string,
    leadType:number,
    assignedAgent ?: mongoose.Types.ObjectId
    priority: number,
    leadSource : number,
    createdBy : mongoose.Types.ObjectId,
    status: number,
    createdAt:Date,
    updatedAt:Date,
    referredBy?:string,
    assignedAgentData ?: IUser[],
    createdByData ?: IUser[]
    
}

export interface LeadFilterType {
  fromDate?: Date;
  toDate?: Date;
  leadCategory ?: (string | number)[];
  leadStatus ?: (string | number)[];
  priority ?: (string | number)[];
  leadSource ?: (string | number)[];
  staff ?: (string | number)[];
  createBy ?: (string | number)[];
}

export interface BulkLeadType {
  name: string
  phoneNumber: string
  countryCode?: string
  address ?: string
  leadCategory ?: string
  staff ?: string
  leadSource ?: string
  priority ?: string,
  createdBy ?: mongoose.Types.ObjectId
}
export interface BulkLeadTransformType {
     name: string,
      phoneNumber:string,
      assignedAgent: mongoose.Types.ObjectId,
      priority: number, // default to Normal
      address:string,
      leadSource: number, 
      createdBy:mongoose.Types.ObjectId,
}