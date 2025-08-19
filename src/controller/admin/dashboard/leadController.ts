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

            // by default start of month and to current date
            const startOfMonth = new Date(new Date().setDate(1));

const fromDate = req.query.from ? new Date(req.query.from as string) : startOfMonth;
const toDate   = req.query.to ? new Date(req.query.to as string) : new Date();

const response = await this.__dashboardLeadService.getDashboardLeadData(fromDate, toDate);
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

    async getMonthWiseReport(req:Request, res:Response):Promise<void>{
        try {
            const currentMonthStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const currentDate = new Date();
            const prevMonthLastDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
            const prevMonthFirstDate = new Date(new Date().getFullYear(), new Date().getMonth()-1, 1);
            const response = await this.__dashboardLeadService.getMonthWiseReport(currentMonthStartDate, currentDate, prevMonthFirstDate, prevMonthLastDate);
            if(response)
                res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.SUCCESS, data: response})
        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }
}