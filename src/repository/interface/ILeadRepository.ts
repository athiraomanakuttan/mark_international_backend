import { BulkLeadTransformType, BulkLeadType, LeadBasicType, LeadFilterType, UpdatedLeadType } from "../../types/leadTypes";
import { LeadresponseType } from "../../types/leadTypes";

export interface ILeadRepository {
    createLead(leadData: LeadBasicType): Promise<any>;
    getLeadByStatus(status:Number,page:number, limit:number, filterData:LeadFilterType, search: string):Promise<LeadresponseType>
    createBulkLead(leadData: BulkLeadTransformType[]):Promise<any>
    // getLeadById(leadId: string): Promise<any>;
    updateLead(leadId: string, leadData: UpdatedLeadType): Promise<any>;
    transferLead(staffId:string, leadData:string[]):Promise<any>
    // deleteLead(leadId: string): Promise<any>;
}