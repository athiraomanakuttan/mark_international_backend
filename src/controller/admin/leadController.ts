import { STATUS_CODE } from "../../constance/statusCode";
import { ILeadService } from "../../service/interface/admin/ILeadService";
import { Request,Response } from "express";
export class LeadController{
    private __leadService:ILeadService
    constructor(leadService:ILeadService){
        this.__leadService = leadService
    }

    async createLead(req:Request, res:Response):Promise<void>{
        try {
            const leadData = req.body
            console.log("leadData",leadData)
            const createData = await this.__leadService.createLead(leadData)
            if(createData){
                res.status(STATUS_CODE.CREATED).json({status:true, message:"lead Created sucessfully"})
                return
            }
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status:false, message:"unable to create lead", data:null})

        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status:false, message:"unable to create lead", data:null})
        }
    }
}