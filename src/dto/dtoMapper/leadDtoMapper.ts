import { LeadType } from "../../types/leadTypes";
import { formatDate } from "../../utils/formatDate";
import { LeadDto } from "../dtoTypes/leadDto";

export const leadDtoMapper = (lead:LeadType): LeadDto=>{
    return {
        id:lead._id,
        name:lead.name,
        phoneNumber:lead.phoneNumber,
        createdById: lead?.createdByData?.[0]?._id  || "",
        createdByName :lead?.createdByData?.[0]?.name || "",
        createdAt: formatDate(lead.createdAt),
        updatedAt: formatDate(lead.updatedAt),
        referredBy: lead.referredBy,
        leadSource:lead.leadSource,
        status: lead.status,
        remarks:lead.remarks,
        assignedAgent_id: lead?.assignedAgentData?.[0]?._id,
        assignedAgent_name: lead?.assignedAgentData?.[0]?.name
    }

    
}
export const leadsMapper = (leads:LeadType[])=>{
    const leadsData = leads.map((lead)=> leadDtoMapper(lead))
    return leadsData
} 

