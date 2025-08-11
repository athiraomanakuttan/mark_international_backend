import { leadsMapper } from "../dto/dtoMapper/leadDtoMapper"
import { ILeadRepository } from "../repository/interface/ILeadRepository"
import { LeadBasicType, LeadFilterType } from "../types/leadTypes"
import { ILeadService } from "./interface/ILeadService"


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
}