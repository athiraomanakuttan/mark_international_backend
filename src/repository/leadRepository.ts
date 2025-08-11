import { ILeadRepository } from "./interface/ILeadRepository";
import Lead from "../model/leadModel";
import { LeadBasicType, LeadresponseType, LeadType } from "../types/leadTypes";
export class LeadRepository implements ILeadRepository {
  async createLead(leadData: LeadBasicType): Promise<any> {
    try {
      const newLead = new Lead(leadData);
      await newLead.save();
      return newLead;
    } catch (error) {
      throw new Error("Failed to create staff");
    }
  }
  async getLeadByStatus(
    status: Number,
    page: number,
    limit: number
  ): Promise<LeadresponseType> {
    try {
      const skip = (page - 1) * limit;
      let statusArr = [];
      if (status === 7) statusArr = [1, 2, 3, 4, 5, 6];
      else statusArr = [status];

      const leadList = await Lead.aggregate([
        {
          $match: { status: { $in: statusArr } },
        },
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "assignedAgent",
            as: "assignedAgentData",
          },
        },
        {
          $lookup: {
            from: "users",
            foreignField: "_id",
            localField: "createdBy",
            as: "createdByData",
          },
        },
        {
          $sort: { updatedAt: -1 },
        },
        { $skip: skip },
        { $limit: limit },
      ]);
      const totalRecords = await Lead.find({
        status: { $in: statusArr },
      }).countDocuments();
      return { lead: leadList as LeadType[] , totalRecords };
    } catch (error) {
      throw error;
    }
  }

  // Placeholder methods for future implementation
  // async getLeadById(leadId: string): Promise<any> {
  //     return { success: true, data: { id: leadId } };
  // }

  // async updateLead(leadId: string, leadData: any): Promise<any> {
  //     return { success: true, data: { id: leadId, ...leadData } };
  // }

  // async deleteLead(leadId: string): Promise<any> {
  //     return { success: true, message: `Lead ${leadId} deleted` };
  // }
}
