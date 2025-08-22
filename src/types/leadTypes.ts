import mongoose, { Types } from "mongoose"
import { IUser } from "./modelTypes"
export interface LeadBasicType{
  _id?: Types.ObjectId;
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

//new added
called_date?: Date,
call_result?:number,
// new added

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
    remarks ?: string,
    called_date?: Date,
    call_result?:number,
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
  called_date?: Date,
call_result?:number,
}

export interface BulkLeadType {
  name: string
  phoneNumber: string
  countryCode?: string
  address ?: string
  leadCategory ?: string
  called_date?: Date
  call_result?:number
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

export  interface UpdatedLeadType    {
    name?:string,
    phoneNumber ?: string,
    leadType ?:number,
    assignedAgent ?: mongoose.Types.ObjectId
    priority ?: number,
    leadSource ?: number,
    createdBy ?: mongoose.Types.ObjectId,
    status ?: number,
    createdAt ?:Date,
    updatedAt ?:Date,
    called_date?: Date,
    call_result?:number,
    referredBy?:string,
    assignedAgentData ?: IUser[],
    createdByData ?: IUser[]
    
}

