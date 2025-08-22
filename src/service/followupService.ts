import { IFollowupRepository } from "../repository/interface/IFollowupRepository";
import { FollowUpType } from "../types/followupType";
import { IFollowupService } from "./interface/IFollowupService";

export class FollowupService implements IFollowupService {
    private __followupRepository: IFollowupRepository
    constructor( followupRepository: IFollowupRepository) {
        this.__followupRepository = followupRepository
    }

    async createFollowup(data: FollowUpType): Promise<any> {
        return this.__followupRepository.createFollowup(data);
    }
}
