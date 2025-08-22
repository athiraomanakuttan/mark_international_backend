import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
import { ILeadService } from "../service/interface/ILeadService";
import { Request,Response } from "express";
import { CustomRequestType } from "../types/requestType";
import { BulkLeadType, LeadBasicType, LeadFilterType, LeadType } from "../types/leadTypes";
import { ITransferLeadService } from "../service/interface/ITransferLeadService";
import { ILeadTransfer } from "../model/leadTransfer";
import { LeadDto } from "../dto/dtoTypes/leadDto";
import { LeadTransferType } from "../types/lead-transfer-type";
import { LEAD_PRIORITIES, LEAD_STATUS } from "../data/lead-data";
import { ILeadHistoryService } from "../service/interface/ILeadHistoryService";
import { ILeadHistory } from "../model/leadHistoryModel";
import mongoose  from "mongoose";
import { error } from "console";
export class LeadController{
    private __leadService:ILeadService
    private _transferService: ITransferLeadService
    private _leadHistoryService: ILeadHistoryService;
    constructor(leadService:ILeadService, transferService:ITransferLeadService, leadHistoryService:ILeadHistoryService){
        this.__leadService = leadService
        this._transferService = transferService
        this._leadHistoryService = leadHistoryService
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
                const leadHistoryData = {
                    leadId: createData.id,
                    createdBy: new mongoose.Types.ObjectId(userId),
                    historyType: 1
                } as ILeadHistory
                await this._leadHistoryService.createLeadHistory(leadHistoryData)
                if(finalData.assignedAgent){
                    const leadHistoryData = {
                        leadId : createData.id,
                        from : new mongoose.Types.ObjectId(userId),
                        to : new mongoose.Types.ObjectId(finalData.assignedAgent),
                        historyType: 4
                    } as ILeadHistory
                    await this._leadHistoryService.createLeadHistory(leadHistoryData)
                }
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
            const response = await this.__leadService.getLeadByStatus(Number(status),Number(page),Number(limit), filterdata as LeadFilterType,search)
            if(response)
                res.status(STATUS_CODE.OK).json({status:true, message:"data fetched successfully", data:response})

        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async getUnassignedLead(req:Request, res:Response):Promise<void>{
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
            const response = await this.__leadService.getUnassignedLead(Number(status),Number(page),Number(limit), filterdata as LeadFilterType,search)
            if(response)
                res.status(STATUS_CODE.OK).json({status:true, message:"data fetched successfully", data:response})

        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }


 async createBulkLead(req:CustomRequestType, res:Response):Promise<void>{
    try {
        const userId = req.user?.id
        if(!userId){
        res.status(STATUS_CODE.UNAUTHORIZED).json({status: false, message:MESSAGE_CONST.UNAUTHORIZED})
            return
        }
        const leadData = req.body
        console.log(leadData,"userId", userId) 
        const response = await this.__leadService.createBulkLead(userId, leadData as BulkLeadType[])
        if(response){
            if(Array.isArray(response) && response.length > 0){
                response.forEach(async (rowData)=>{
                    const createdLead = {
                        leadId: rowData.id,
                        createdBy: new mongoose.Types.ObjectId(userId),
                        historyType: 1
                    } as ILeadHistory
                    await this._leadHistoryService.createLeadHistory(createdLead)
                    if(rowData.assignedAgent) {
                        const data = {
                            leadId: rowData.id,
                            historyType: 4,
                            to: rowData.assignedAgent,
                            from:new mongoose.Types.ObjectId(userId),
                        } as ILeadHistory
                        await this._leadHistoryService.createLeadHistory(data)
                    }
                })
               
            }
            res.status(STATUS_CODE.OK).json({status: true, message:"file upload successfull"})
        }
    } catch (error) {
        console.log("lead upload error in controller",error)
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
    }
}

async updateLead(req:CustomRequestType, res:Response):Promise<void>{
        try{
            const leadId = req.params.id
            const leadData = req.body
            const userId = req.user?.id
            if(!userId){
                res.status(STATUS_CODE.UNAUTHORIZED).json({status: false, message:MESSAGE_CONST.UNAUTHORIZED})
                return
            }
            const currentLeadData = await this.__leadService.getLeadById([leadId])
            const response = await this.__leadService.updateLead(leadId, leadData)
            if(response){
                if (leadData.assignedAgent) {
    const fromAgent = currentLeadData[0]?.assignedAgent && mongoose.Types.ObjectId.isValid(currentLeadData[0].assignedAgent)
        ? new mongoose.Types.ObjectId(currentLeadData[0].assignedAgent)
        : null;

    const toAgent = mongoose.Types.ObjectId.isValid(leadData.assignedAgent)
        ? new mongoose.Types.ObjectId(leadData.assignedAgent)
        : null;

    const historyData = {
        leadId: new mongoose.Types.ObjectId(String(leadId)),
        from: fromAgent,
        to: toAgent,
        updatedBy: new mongoose.Types.ObjectId(String(userId)),
        historyType: 4
    } as ILeadHistory;

    await this._leadHistoryService.createLeadHistory(historyData);
}

                if(leadData.status){
                    const historyData = {
                        leadId: new mongoose.Types.ObjectId(String(leadId)),
                        updatedStatus: leadData.status,
                        updatedBy: new mongoose.Types.ObjectId(String(userId)),
                        historyType: 2
                    } as ILeadHistory
                    await this._leadHistoryService.createLeadHistory(historyData)
                }
                res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.UPDATION_SUCCESS})
            }

        }catch(err){
            console.log("error===========", err)
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status:false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
}

async transferLead(req:Request, res:Response):Promise<void>{
    try {
        const {staffId, leadList} = req.body
        
        if(!staffId){
        res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message: "staff id is empty"})
            return
        }
        else if(leadList.lead<=0)
        {
            res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message: "lead lsit  is empty"})
            return
        }
        const leadDetails = await this.__leadService.getLeadById(leadList)
        const transferData:LeadTransferType[] = []
        leadDetails.forEach((lead)=>{
            transferData.push({
                leadId:lead._id,
                fromStaff:lead.assignedAgent,
                toStaff:staffId,
            })
        })
        const response = await this.__leadService.transferLead(staffId, leadList)
        if(response){
        const transferHistory = await this._transferService.createTransferHistory(transferData)
        res.status(STATUS_CODE.OK).json({status: true, message: MESSAGE_CONST.UPDATION_SUCCESS})
        }
    } catch (error) {
        console.log(error)
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR})
    }
}

async deleteMultipleLeads(req:Request, res:Response):Promise<void>{
    try {
        const {leadStatus =-1, leadList} = req.body
        const response = await this.__leadService.deleteMultipleLead(Number(leadStatus), leadList) 
        if(response)
            res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.UPDATION_SUCCESS})

    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
    }
}

async leadAssignToStaff(req:Request, res:Response):Promise<void>{
    try{
        const {leadList, staffId} = req.body
        if(!staffId){
            res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message:MESSAGE_CONST.BAD_REQUEST})
            return
        }
        if(leadList.length<=0){
        res.status(STATUS_CODE.BAD_REQUEST).json({status: false, message:MESSAGE_CONST.BAD_REQUEST})
            return
        }
        const response = await this.__leadService.leadAssignToStaff(staffId, leadList)
        if(response){
        res.status(STATUS_CODE.OK).json({status: true, message:MESSAGE_CONST.UPDATION_SUCCESS})
            
        }
    }catch(err){
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})

    }
}


async getExportLead(req: Request, res: Response): Promise<void> {
  try {
    const { filter = "", search = "" } = req.query as {
      filter?: string;
      search?: string;
    };

    const filterdata = JSON.parse(filter);
    const response = await this.__leadService.getLeadforExport(
      filterdata as LeadFilterType,
      search
    );

    if (response) {
      const header = "Name,Phone,Category,Status,Priority,Created Date,time,Assigned Staff,Created by\n";
      const rows = (response as LeadDto[])
        .map((l: LeadDto) =>{
            const priority = LEAD_PRIORITIES.find((data) => data.value === l.priority)?.name || 'N/A';
            const status = LEAD_STATUS.find((data) => data.value === l.status)?.name  || 'N/A';
            return `${l.name},${l.phoneNumber},${l.category},${status},${priority},${l.createdAt},${l.assignedAgent_name ?? ""},${l.createdByName ?? ""}\n`;
    })
        .join("\n");

      const csv = header + rows;

      res.setHeader("Content-Disposition", "attachment; filename=leads.csv");
      res.setHeader("Content-Type", "text/csv");
      res.status(200).send(csv);
      return;
    }

    res.status(404).json({ status: false, message: "No leads found" });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
}




}