import { LeadBasicType } from "../../../types/leadTypes";

export interface ILeadService{
    createLead(leadData:LeadBasicType):Promise<any>
}