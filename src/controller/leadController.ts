import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
import { ILeadService } from "../service/interface/ILeadService";
import { Request,Response } from "express";
import { CustomRequestType } from "../types/requestType";
import { LeadBasicType, LeadFilterType } from "../types/leadTypes";
export class LeadController{
    private __leadService:ILeadService
    constructor(leadService:ILeadService){
        this.__leadService = leadService
    }

    async createLead(req:CustomRequestType, res:Response):Promise<void>{
        try {
        
            const userId = req.user?.id
            console.log("user id ",userId)
            if(!userId){
                res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message:MESSAGE_CONST.UNAUTHORIZED})
                return
            }
            const leadData = req.body

            const finalData = {...leadData, createdBy:userId} as LeadBasicType
            const createData = await this.__leadService.createLead(finalData)
            if(createData){
                res.status(STATUS_CODE.CREATED).json({status:true, message:"lead Created sucessfully"})
                return
            }
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status:false, message:"unable to create lead", data:null})

        } catch (error) {
            console.log(error)
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status:false, message:"unable to create lead", data:null})
        }
    }

    async getLead(req:Request, res:Response):Promise<void>{
        try {
           const {
  status = "7",
  page = "1",
  limit = "10",
  filter = "",
  search = ""
} = req.query as {
  status?: string;
  page?: string;
  limit?: string;
  filter?: string;
  search?: string;
};
    const filterdata = JSON.parse(filter)
    console.log("filterdata",filterdata)
            const response = await this.__leadService.getLeadByStatus(Number(status),Number(page),Number(limit), filterdata as LeadFilterType,search)
            if(response)
                res.status(STATUS_CODE.OK).json({status:true, message:"data fetched successfully", data:response})

        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }
}