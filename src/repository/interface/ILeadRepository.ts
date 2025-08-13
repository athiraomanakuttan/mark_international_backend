import { LeadIdWithAgent } from "../../types/lead-transfer-type";
import { BulkLeadTransformType, BulkLeadType, LeadBasicType, LeadFilterType, LeadType, UpdatedLeadType } from "../../types/leadTypes";
import { LeadresponseType } from "../../types/leadTypes";

export interface ILeadRepository {
    createLead(leadData: LeadBasicType): Promise<any>;
    getLeadByStatus(status:Number,page:number, limit:number, filterData:LeadFilterType, search: string):Promise<LeadresponseType>
    getUnassignedLead(status:Number,page:number, limit:number, filterData:LeadFilterType, search: string):Promise<LeadresponseType>
    createBulkLead(leadData: BulkLeadTransformType[]):Promise<any>
    // getLeadById(leadId: string): Promise<any>;
    updateLead(leadId: string, leadData: UpdatedLeadType): Promise<any>;
    transferLead(staffId:string, leadData:string[]):Promise<any>
    deleteMultipleLeads(status:number, leadData:string[]):Promise<any>
    getLeadsById(leadList:string[]):Promise<LeadIdWithAgent[]>
    leadAssignToStaff(staffId: string, leadList:string[]):Promise<any>
    // deleteLead(leadId: string): Promise<any>;
}