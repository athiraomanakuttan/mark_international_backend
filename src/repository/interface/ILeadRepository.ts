import { LeadBasicType, LeadFilterType } from "../../types/leadTypes";
import { LeadresponseType } from "../../types/leadTypes";

export interface ILeadRepository {
    createLead(leadData: LeadBasicType): Promise<any>;
    getLeadByStatus(status:Number,page:number, limit:number, filterData:LeadFilterType, search: string):Promise<LeadresponseType>
    // getLeadById(leadId: string): Promise<any>;
    // updateLead(leadId: string, leadData: any): Promise<any>;
    // deleteLead(leadId: string): Promise<any>;
}