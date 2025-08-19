import { Request, Response } from "express";
import {ILeadHistoryService} from "../service/interface/ILeadHistoryService";
import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
export class LeadHistoryController{
    private __leadHistoryService : ILeadHistoryService
    constructor(leadHistoryService: ILeadHistoryService) {
        this.__leadHistoryService = leadHistoryService
    }

    async getAllLeadHistory(req: Request, res: Response): Promise<void> {
        const { page = 1, limit = 10 } = req.query;
        const { leadId } = req.params;
        try {
            const leadHistory = await this.__leadHistoryService.getLeadHistory(leadId, Number(page), Number(limit));
            res.status(STATUS_CODE.OK).json({ status: true, message: MESSAGE_CONST.SUCCESS, data: leadHistory });
        } catch (error) {
             res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
        }
    }

    
}