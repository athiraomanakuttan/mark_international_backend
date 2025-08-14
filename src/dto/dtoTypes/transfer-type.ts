import  { Types } from "mongoose";

export interface TransferDtoType{
    id:Types.ObjectId,
name: string,
phoneNumber: string,
fromStaff: string,
toStaff: string,
status: number,
category?: string,
transferDate: string,

}