import { LeadBasicType, LeadFilterType } from "../../types/leadTypes";

export interface ILeadService{
    createLead(leadData:LeadBasicType):Promise<any>
    getLeadByStatus(status:number,page:number,limit:number,filterData:LeadFilterType,search:string):Promise<any>
}
