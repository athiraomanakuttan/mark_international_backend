import { ILeadRepository } from "../../repository/interface/admin/ILeadRepository";
import { LeadBasicType } from "../../types/leadTypes";
import { ILeadService } from "../interface/admin/ILeadService";

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
}