import { FollowupResponseType } from "../../types/followupType";
import { formatDate } from "../../utils/formatDate";
import { FollowupDto } from "../dtoTypes/follwupDto";

export const followupDtoMapper = (data: FollowupResponseType[]): FollowupDto[] => {
  return data.map(item => {
    const assignedAgent = item.assignedAgent ?? []; // fallback to []
    const lead = item.lead ?? [];

    return {
      name: lead[0]?.name || "",
      phoneNumber: assignedAgent[0]?.phoneNumber || "",
      createdDate: formatDate(lead[0]?.createdAt!) || "",
      status: lead[0]?.status || 0,
      assignedAgentName: assignedAgent[0]?.name || "",
      leadId: lead[0]?._id?.toString() || ""
    };
  });
};


