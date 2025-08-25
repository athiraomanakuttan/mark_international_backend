import { FollowUpType } from "../../types/followupType";

export interface IFollowupRepository {
    createFollowup(data: FollowUpType): Promise<any>;
    getAllFollowups(userId?: string): Promise<any>;
    updateFollowup(followupIds: string[], updateData: Partial<FollowUpType>): Promise<void>;
}