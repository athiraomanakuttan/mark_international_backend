import LeadHistory, { ILeadHistory} from "../model/leadHistoryModel";
import { ILeadHistoryRepository } from "./interface/ILeadHistoryRepository";

export class LeadHistoryRepository implements ILeadHistoryRepository {
    async createLeadHistory(data: ILeadHistory): Promise<ILeadHistory> {
       try{
            const leadHistory = new LeadHistory(data);
            await leadHistory.save();
            return leadHistory;
       }catch(err){ throw err} 
    }

    async getLeadHistory(leadId: string, page: number, limit: number): Promise<ILeadHistory | null> {
        try{
            const skip = (page - 1) * limit;
            const leadHistory = await LeadHistory.findById(leadId).skip(skip).limit(limit);
            return leadHistory;
        }catch(err){ throw err}
    }
}
