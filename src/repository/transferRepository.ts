import { ILeadTransfer, TransferModel } from '../model/leadTransfer'
import { LeadTransferType } from '../types/lead-transfer-type'
import {ITransferRepository} from './interface/ITransferRepository'
export class TransferRepository implements ITransferRepository{
    async createTransferHistory(transferData: LeadTransferType[]): Promise<any> {
        try {
            return await TransferModel.insertMany(transferData)
            
        } catch (error) {
            throw error
        }
    }
}