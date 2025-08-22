import { FollowUpType } from "../../types/followupType";

export interface IFollowupService{
    createFollowup(data: FollowUpType): Promise<any>;
}