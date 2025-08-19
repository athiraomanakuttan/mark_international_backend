import { Request, Response } from "express";
import {ILeadHistoryService} from "../service/interface/ILeadHistoryService";
import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
export class LeadHistoryController{
    constructor(private leadHistoryService: ILeadHistoryService) {}

    async getLeadHistory(req: Request, res: Response): Promise<Response> {
        try {
            const leadHistory = await this.leadHistoryService.getLeadHistory(req.params.id);
            return res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: leadHistory});
        } catch (error) {
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
        }
    }

    
}