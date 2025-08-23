
import { TransferLeadsMapper } from "../dto/dtoMapper/transferDtoMapper";
import { TransferDtoType } from "../dto/dtoTypes/transfer-type";
import { ITransferRepository } from "../repository/interface/ITransferRepository";
import { LeadTransferType } from "../types/lead-transfer-type";
import { LeadFilterType } from "../types/leadTypes";
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

    async getTransferList(page: number, limit: number, filter: LeadFilterType, search: string): Promise<any > {
        try {
            const response = await this._transferLeadRepository.getTransferList(page, limit, filter,search)
            const leads =  TransferLeadsMapper(response.transfers)
            return {leads, totalRecords: response.totalRecords}
        } catch (error) {
            throw error
        }
    }
}