import { LeadDto } from "../../dto/dtoTypes/leadDto";
import { LeadIdWithAgent } from "../../types/lead-transfer-type";
import { BulkLeadType, LeadBasicType, LeadFilterType, LeadType, UpdatedLeadType } from "../../types/leadTypes";

export interface ILeadService{
    createLead(leadData:LeadBasicType):Promise<any>
    getLeadByStatus(status:number,page:number,limit:number,filterData:LeadFilterType,search:string):Promise<any>
    createBulkLead(userId:string, leadData:BulkLeadType[]):Promise<any>
    updateLead(leadId:string, leadData:UpdatedLeadType):Promise<any>
    transferLead(staffId: string, leadList:string[]):Promise<LeadType[]>
    deleteMultipleLead(status:number, leadList:string[]):Promise<any>
    getLeadById(leadId:string[]):Promise<LeadIdWithAgent[]>
    getUnassignedLead(status:number,page:number,limit:number,filterData:LeadFilterType,search:string):Promise<any>
    leadAssignToStaff(staffId: string, leadList:string[]):Promise<any>
    getLeadforExport(filterData:LeadFilterType, search:string):Promise<LeadDto[]>
    getFullLeadDataById(leadId:string):Promise<LeadDto | null>
}
