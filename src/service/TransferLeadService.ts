import { ILeadTransfer } from "../model/leadTransfer";
import { ITransferRepository } from "../repository/interface/ITransferRepository";
import { LeadTransferType } from "../types/lead-transfer-type";
import { ITransferLeadService } from "./interface/ITransferLeadService";

export class TransferLeadService implements ITransferLeadService{
    private _transferLeadRepository : ITransferRepository
    constructor(transferRepository:ITransferRepository){
        this._transferLeadRepository= transferRepository
    }

    async createTransferHistory(data: LeadTransferType[]): Promise<any> {
        try {
            return await this._transferLeadRepository.createTransferHistory(data)
        } catch (error) {
            throw error
        }
    }
}