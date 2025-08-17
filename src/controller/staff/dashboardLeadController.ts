
import { Request,Response } from "express";
import { IDashboardLeadService } from "../../service/interface/staff/IDashboardLeadService";
import { STATUS_CODE } from "../../constance/statusCode";
import { MESSAGE_CONST } from "../../constant/MessageConst";
import { CustomRequestType } from "../../types/requestType";

export class DashboardLeadController{
    private __dashboardLeadService : IDashboardLeadService
    constructor(dashboardLeadService : IDashboardLeadService){
        this.__dashboardLeadService = dashboardLeadService
    }

    async getLeadData(req:CustomRequestType, res:Response):Promise<void>{
        try {
            const userId =  req.user?.id
            const response = await this.__dashboardLeadService.getDashboardLeadData(String(userId))
            if(response)
                res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: response})
        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async getStaffWiseReport(req:CustomRequestType, res:Response):Promise<void>{
            try {
                const {from, to} = req.query
                const fromDate = new Date(String(from))
                const toDate = new Date(String(to))
                const staffId = req.user?.id
                const response = await this.__dashboardLeadService.getStaffWiseReport(fromDate,toDate, String(staffId))
                if(response)
                    res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: response})
    
            } catch (error) {
                res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
            }
        }



}