import { LeadresponseType } from "../../../types/leadTypes";
import { BulkLeadTransformType, BulkLeadType, LeadBasicType, LeadFilterType, LeadType, UpdatedLeadType } from "../../../types/leadTypes";

export interface ILeadRepository {
    createLead(leadData: LeadBasicType): Promise<any>;
    getLeadByStatus(status:Number,page:number, limit:number, filterData:LeadFilterType, search: string,  staffId:string):Promise<LeadresponseType>
    createBulkLead(leadData: BulkLeadTransformType[]):Promise<any>
    updateLead(leadId: string, leadData: UpdatedLeadType): Promise<any>;
    deleteMultipleLeads(status:number, leadData:string[]):Promise<any>
    getLeadforExport( filterData:LeadFilterType, search:string, staffId:string):Promise<LeadType[]>
}