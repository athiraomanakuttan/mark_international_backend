import { FollowupDto } from "../../dto/dtoTypes/follwupDto";
import { FollowUpType } from "../../types/followupType";

export interface IFollowupService{
    createFollowup(data: FollowUpType): Promise<any>;
    getAllFollowups(userId?: string): Promise<FollowupDto[]>;
    updateFollowup(followupIds: string[], updateData: Partial<FollowUpType>): Promise<void>;
}