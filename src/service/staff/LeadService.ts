import mongoose from "mongoose"
import { leadDtoMapper, leadsMapper } from "../../dto/dtoMapper/leadDtoMapper"
import { BulkLeadTransformType, BulkLeadType, LeadBasicType, LeadFilterType, LeadType, UpdatedLeadType } from "../../types/leadTypes"
import { ILeadService } from "../interface/staff/ILeadService"
import { ILeadRepository } from "../../repository/interface/staff/ILeadRepository"
import { LeadIdWithAgent } from "../../types/lead-transfer-type"
import { LeadDto } from "../../dto/dtoTypes/leadDto"



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
    async getLeadByStatus(status: number = 7, page: number = 1, limit: number = 10, filterData:LeadFilterType, search:string, staffId: string): Promise<any> {
        try {
            const response = await this.__leadRepository.getLeadByStatus(status,page,limit, filterData, search,staffId)
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

    
    async deleteMultipleLead(status: number, leadList: string[]): Promise<any> {
      try {
        return await this.__leadRepository.deleteMultipleLeads(status, leadList)
      } catch (error) {
        throw error
      }
    }

    async getLeadforExport(filterData:LeadFilterType, search:string, staffId: string): Promise<LeadDto[]> {
        try {
            const response = await this.__leadRepository.getLeadforExport( filterData, search,staffId)
            return leadsMapper(response)
             
        } catch (error) {
            throw error
        }
    }

    
}