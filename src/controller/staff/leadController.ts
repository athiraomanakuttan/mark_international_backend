import { STATUS_CODE } from "../../constance/statusCode";
import { MESSAGE_CONST } from "../../constant/MessageConst";
import { Request, Response } from "express";
import {
  BulkLeadType,
  LeadBasicType,
  LeadFilterType,
  LeadType,
} from "../../types/leadTypes";
import { ILeadService } from "../../service/interface/staff/ILeadService";
import { CustomRequestType } from "../../types/requestType";
import mongoose from "mongoose";
import { LeadDto } from "../../dto/dtoTypes/leadDto";
import { LEAD_PRIORITIES, LEAD_STATUS } from "../../data/lead-data";
import { ILeadHistoryService } from "../../service/interface/ILeadHistoryService";
import { ILeadHistory } from "../../model/leadHistoryModel";
export class LeadController {
  private __leadService: ILeadService;
  private _leadHistoryService: ILeadHistoryService;
  constructor(leadService: ILeadService, leadHistoryService: ILeadHistoryService) {
    this.__leadService = leadService;
    this._leadHistoryService = leadHistoryService;  
  }

  async createLead(req: CustomRequestType, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ status: false, message: MESSAGE_CONST.UNAUTHORIZED });
        return;
      }
      const leadData = req.body;

      const finalData = { ...leadData, createdBy: userId , assignedAgent:new mongoose.Types.ObjectId(userId)} as LeadBasicType;
      const createData = await this.__leadService.createLead(finalData);
      if (createData) {
        const leadHistoryData = {
          leadId: createData.id,
          createdBy: new mongoose.Types.ObjectId(userId),
          historyType: 1
        } as ILeadHistory;
        await this._leadHistoryService.createLeadHistory(leadHistoryData);
        res
          .status(STATUS_CODE.CREATED)
          .json({ status: true, message: "lead Created sucessfully" });
        return;
      }
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "unable to create lead", data: null });
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: "unable to create lead", data: null });
    }
  }

  async getLead(req: CustomRequestType, res: Response): Promise<void> {
    try {
      const {
        status = "7",
        page = "1",
        limit = "10",
        filter = "",
        search = "",
      } = req.query as {
        status?: string;
        page?: string;
        limit?: string;
        filter?: string;
        search?: string;
      };
      const userId = req.user?.id;
      if (!userId) {
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ status: false, message: MESSAGE_CONST.UNAUTHORIZED });
        return;
      }
      const filterdata = JSON.parse(filter);
      const response = await this.__leadService.getLeadByStatus(
        Number(status),
        Number(page),
        Number(limit),
        filterdata as LeadFilterType,
        search,
        userId
      );
      if (response)
        res
          .status(STATUS_CODE.OK)
          .json({
            status: true,
            message: "data fetched successfully",
            data: response,
          });
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
    }
  }

  async updateLead(req: Request, res: Response): Promise<void> {
    try {
      const leadId = req.params.id;
      const leadData = req.body;
      const response = await this.__leadService.updateLead(leadId, leadData);
      if (response)
        res
          .status(STATUS_CODE.OK)
          .json({ status: true, message: MESSAGE_CONST.UPDATION_SUCCESS });
    } catch (err) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteMultipleLeads(req: Request, res: Response): Promise<void> {
    try {
      const { leadStatus = -1, leadList } = req.body;
      const response = await this.__leadService.deleteMultipleLead(
        Number(leadStatus),
        leadList
      );
      if (response)
        res
          .status(STATUS_CODE.OK)
          .json({ status: true, message: MESSAGE_CONST.UPDATION_SUCCESS });
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
    }
  }

    async getExportLead(req: CustomRequestType, res: Response): Promise<void> {
    try {
      const {
        
        filter = "",
        search = "",
      } = req.query as {
        status?: string;
        page?: string;
        limit?: string;
        filter?: string;
        search?: string;
      };
      const userId = req.user?.id;
      if (!userId) {
        res
          .status(STATUS_CODE.UNAUTHORIZED)
          .json({ status: false, message: MESSAGE_CONST.UNAUTHORIZED });
        return;
      }
      const filterdata = JSON.parse(filter);
      const response = await this.__leadService.getLeadforExport(
        filterdata as LeadFilterType,
        search,
        userId
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
    } catch (error) {
      res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ status: false, message: MESSAGE_CONST.INTERNAL_SERVER_ERROR });
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
          res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
      }
  }

  
}
