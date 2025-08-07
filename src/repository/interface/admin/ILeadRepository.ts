import { LeadBasicType } from "../../../types/leadTypes";

export interface ILeadRepository {
    createLead(leadData: LeadBasicType): Promise<any>;
    // getLeadById(leadId: string): Promise<any>;
    // updateLead(leadId: string, leadData: any): Promise<any>;
    // deleteLead(leadId: string): Promise<any>;
}