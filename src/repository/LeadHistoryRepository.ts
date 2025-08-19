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

    async getLeadHistory(id: string): Promise<ILeadHistory | null> {
        try{
            const leadHistory = await LeadHistory.findById(id);
            return leadHistory;
        }catch(err){ throw err}
    }
}
