import { LeadBasicType } from "../../types/leadTypes";
import { LeadresponseType } from "../../types/leadTypes";

export interface ILeadRepository {
    createLead(leadData: LeadBasicType): Promise<any>;
    getLeadByStatus(status:Number,page:number, limit:number):Promise<LeadresponseType>
    // getLeadById(leadId: string): Promise<any>;
    // updateLead(leadId: string, leadData: any): Promise<any>;
    // deleteLead(leadId: string): Promise<any>;
}