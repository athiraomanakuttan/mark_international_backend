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