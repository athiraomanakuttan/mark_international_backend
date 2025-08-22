import Followup from "../model/followupModel";
import { FollowUpType } from "../types/followupType";
import { IFollowupRepository } from "./interface/IFollowupRepository";

export class FollowupRepository implements IFollowupRepository {
    async createFollowup(data: FollowUpType): Promise<any> {
        try {
            const response = new Followup(data)
            await response.save()
            return response
        } catch (error) {
           throw error 
        }
    }
}
