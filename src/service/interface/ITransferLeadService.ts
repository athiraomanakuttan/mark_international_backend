import { FilterQuery } from "mongoose";
import { ILeadTransfer } from "../../model/leadTransfer";
import { LeadTransferType } from "../../types/lead-transfer-type";
import { LeadFilterType } from "../../types/leadTypes";
// import { TransferDtoType } from "../../dto/dtoMapper/transferDtoMapper";

export interface ITransferLeadService{
    createTransferHistory(data:LeadTransferType[]):Promise<any>
    getTransferList(page:number,limit:number, filter:LeadFilterType,search:string):Promise<any>
}