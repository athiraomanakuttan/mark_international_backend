import { ILeadTransfer } from "../../model/leadTransfer";
import { LeadTransferType } from "../../types/lead-transfer-type";

export interface ITransferLeadService{
    createTransferHistory(data:LeadTransferType[]):Promise<any>
}