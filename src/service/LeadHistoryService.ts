import { ILeadHistory } from "../model/leadHistoryModel";
import { ILeadHistoryRepository } from "../repository/interface/ILeadHistoryRepository";
import { ILeadHistoryService } from "./interface/ILeadHistoryService";

class LeadHistoryService implements ILeadHistoryService {
    private __leadHistoryRepository: ILeadHistoryRepository;
    constructor(leadHistoryRepository: ILeadHistoryRepository) {
        this.__leadHistoryRepository = leadHistoryRepository;
    }
    async createLeadHistory(data: ILeadHistory): Promise<any> {
        return await this.__leadHistoryRepository.createLeadHistory(data);
    }

    async getLeadHistory(id: string): Promise<any> {
        return await this.__leadHistoryRepository.getLeadHistory(id);
    }
}