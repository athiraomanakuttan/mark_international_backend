import { TransferFetchType } from "../../types/lead-transfer-type";
import { formatDate } from "../../utils/formatDate";
import { TransferDtoType } from "../dtoTypes/transfer-type";



export const TransferLeadMapper = (lead: TransferFetchType):TransferDtoType=>{
    return {
        id: lead._id,
        name:lead?.leadData?.name,
        category: lead?.leadData?.category || "",
        fromStaff:lead?.fromStaffData?.name,
        toStaff: lead?.toStaffData?.name,
        phoneNumber:lead?.leadData.phoneNumber,
        status: lead?.leadData.status,
        transferDate: formatDate(lead?.transferDate)
    }
}

export const TransferLeadsMapper = (leadData: TransferFetchType[]):TransferDtoType[]=>{
    const transferData = leadData.map((lead)=>TransferLeadMapper(lead))
    return transferData
}