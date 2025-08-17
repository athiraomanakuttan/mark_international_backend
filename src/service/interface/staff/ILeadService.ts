import { LeadIdWithAgent } from "../../../types/lead-transfer-type";
import { BulkLeadType, LeadBasicType, LeadFilterType, LeadType, UpdatedLeadType } from "../../../types/leadTypes";

export interface ILeadService{
    createLead(leadData:LeadBasicType):Promise<any>
    getLeadByStatus(status:number,page:number,limit:number,filterData:LeadFilterType,search:string, staffId: string):Promise<any>
    createBulkLead(userId:string, leadData:BulkLeadType[]):Promise<any>
    updateLead(leadId:string, leadData:UpdatedLeadType):Promise<any>
    deleteMultipleLead(status:number, leadList:string[]):Promise<any>
    
}
