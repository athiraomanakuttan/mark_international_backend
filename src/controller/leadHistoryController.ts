import { Request, Response } from "express";
import {ILeadHistoryService} from "../service/interface/ILeadHistoryService";
import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
import { ILeadService } from "../service/interface/ILeadService";
export class LeadHistoryController{
    private __leadHistoryService : ILeadHistoryService
    private __leadService: ILeadService;
    constructor(leadHistoryService: ILeadHistoryService, leadService: ILeadService) {
        this.__leadHistoryService = leadHistoryService
        this.__leadService = leadService
    }

    async getAllLeadHistory(req: Request, res: Response): Promise<void> {
        const { page = 1, limit = 10 } = req.query;
        const { leadId } = req.params;
        console.log("leadId",leadId)
        try {
            const leadHistory = await this.__leadHistoryService.getLeadHistory(leadId, Number(page), Number(limit));
            res.status(STATUS_CODE.OK).json({ status: true, message: MESSAGE_CONST.SUCCESS, data: leadHistory });
        } catch (error) {
             res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
        }
    }

        async getLeadById(req:Request, res:Response):Promise<void>{
    try {
        const { id } = req.params;
        const lead = await this.__leadService.getFullLeadDataById(String(id));
        if (lead) {
            res.status(STATUS_CODE.OK).json({ status: true, data: lead });
        } else {
            res.status(STATUS_CODE.NOT_FOUND).json({ status: false, message: "Lead not found" });
        }
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
    }
}

}