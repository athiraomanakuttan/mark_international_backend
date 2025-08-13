import mongoose from "mongoose"
import { leadDtoMapper, leadsMapper } from "../dto/dtoMapper/leadDtoMapper"
import { ILeadRepository } from "../repository/interface/ILeadRepository"
import { BulkLeadTransformType, BulkLeadType, LeadBasicType, LeadFilterType, LeadType, UpdatedLeadType } from "../types/leadTypes"
import { ILeadService } from "./interface/ILeadService"
import { LeadDto } from "../dto/dtoTypes/leadDto"
import { LeadIdWithAgent } from "../types/lead-transfer-type"


export class LeadService implements ILeadService{
    private __leadRepository:ILeadRepository
    constructor(leadRepository:ILeadRepository){
        this.__leadRepository= leadRepository
    }
    async createLead(leadData: LeadBasicType): Promise<any> {
        try {
            return this.__leadRepository.createLead(leadData)
        } catch (error) {
            throw error
        }
    }
    async getLeadByStatus(status: number = 7, page: number = 1, limit: number = 10, filterData:LeadFilterType, search:string): Promise<any> {
        try {
            const response = await this.__leadRepository.getLeadByStatus(status,page,limit, filterData, search)
            const leadData = leadsMapper(response.lead)
            return {lead:leadData, totalRecords:response.totalRecords}
        } catch (error) {
            throw error
        }
    }

    async createBulkLead(userId: string, leadData: BulkLeadType[]): Promise<any> {
  try {
    const transformedData   = leadData.map((data) => ({
      name: data.name,
      phoneNumber: data.phoneNumber,
      assignedAgent: data.staff ? new mongoose.Types.ObjectId(data.staff) : undefined,
      priority: data.priority ? Number(data.priority) : 2, // default to Normal
      address: data.address || "",
      leadSource: 2, 
      createdBy: new mongoose.Types.ObjectId(userId),
    
    }));
    console.log("transformedData",transformedData)
    return await this.__leadRepository.createBulkLead(transformedData as BulkLeadTransformType[]);
  } catch (error) {
    throw error;
  }
    }

    async updateLead(leadId: string, leadData: UpdatedLeadType): Promise<any> {
      try {
        return await this.__leadRepository.updateLead(leadId, leadData)
      } catch (error) {
        throw error
      }
    }

    async transferLead(staffId: string, leadList: string[]): Promise<LeadType[]> {
      try {
        return await this.__leadRepository.transferLead(staffId, leadList)
      } catch (error) {
        throw error
      }
    }
    async deleteMultipleLead(status: number, leadList: string[]): Promise<any> {
      try {
        return await this.__leadRepository.deleteMultipleLeads(status, leadList)
      } catch (error) {
        throw error
      }
    }

    async getLeadById(leadId: string[]): Promise<LeadIdWithAgent[]> {
      try {
        let data =  this.__leadRepository.getLeadsById(leadId)
        return data
        
      } catch (error) {
        throw error
      }
    }

    async getUnassignedLead(status: number = 7, page: number = 1, limit: number = 10, filterData:LeadFilterType, search:string): Promise<any> {
        try {
            const response = await this.__leadRepository.getUnassignedLead(status,page,limit, filterData, search)
            const leadData = leadsMapper(response.lead)
            return {lead:leadData, totalRecords:response.totalRecords}
        } catch (error) {
            throw error
        }
    }

    async leadAssignToStaff(staffId: string, leadList: string[]): Promise<any> {
      try{
        return this.__leadRepository.leadAssignToStaff(staffId, leadList)
      }catch(err){
        throw err
      }
    }

}