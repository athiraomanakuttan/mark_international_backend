import { ILeadTransfer } from "../../model/leadTransfer";
import { LeadTransferType } from "../../types/lead-transfer-type";

export interface ITransferRepository{
    createTransferHistory(transferData:LeadTransferType[]):Promise<any>
}