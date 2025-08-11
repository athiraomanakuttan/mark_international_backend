import { LeadBasicType } from "../../types/leadTypes";

export interface ILeadService{
    createLead(leadData:LeadBasicType):Promise<any>
    getLeadByStatus(status:number,page:number,limit:number):Promise<any>
}
