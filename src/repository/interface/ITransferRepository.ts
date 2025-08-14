import { TransferDtoType } from "../../dto/dtoMapper/transferDtoMapper";
import { ILeadTransfer } from "../../model/leadTransfer";
import { LeadTransferType, TransferResponseType } from "../../types/lead-transfer-type";
import { LeadFilterType } from "../../types/leadTypes";

export interface ITransferRepository{
    createTransferHistory(transferData:LeadTransferType[]):Promise<any>
    getTransferList(page:number,limit:number, filter:LeadFilterType,search:string):Promise<TransferResponseType>
    
}