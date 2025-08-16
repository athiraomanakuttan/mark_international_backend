import { STATUS_CODE } from "../../../constance/statusCode";
import { MESSAGE_CONST } from "../../../constant/MessageConst";
import { IDashboardLeadService } from "../../../service/interface/admin/dashboard/IDashboardLeadService";
import { Request,Response } from "express";

export class DashboardLeadController{
    private __dashboardLeadService : IDashboardLeadService
    constructor(dashboardLeadService : IDashboardLeadService){
        this.__dashboardLeadService = dashboardLeadService
    }

    async getLeadData(req:Request, res:Response):Promise<void>{
        try {
            const response = await this.__dashboardLeadService.getDashboardLeadData()
            if(response)
                res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: response})
        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async getStaffWiseReport(req:Request, res:Response):Promise<void>{
        try {
            const {from, to} = req.query
            const fromDate = new Date(String(from))
            const toDate = new Date(String(to))
            const response = await this.__dashboardLeadService.getStaffWiseReport(fromDate,toDate)
            if(response)
                res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: response})

        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }
}