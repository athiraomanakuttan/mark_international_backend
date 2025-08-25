import { match } from "assert";
import Followup from "../model/followupModel";
import { FollowupResponseType, FollowUpType } from "../types/followupType";
import { IFollowupRepository } from "./interface/IFollowupRepository";

export class FollowupRepository implements IFollowupRepository {
  async createFollowup(data: FollowUpType): Promise<any> {
    try {
      const response = new Followup(data);
      await response.save();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAllFollowups(userId?: string): Promise<FollowupResponseType[]> {
    try {
      let currentDate = new Date().toISOString().split("T")[0];
      const matchCondition: any = {
        followup_date: currentDate,
      };
      if (userId) {
        matchCondition["assignedAgentId"] = userId;
        matchCondition["isDeleted"] = false;
      }
      else{
        matchCondition["isAdminDeleted"] = false;
      }

      const data = await Followup.aggregate([
        { $match: matchCondition },
        {
          $addFields: {
            assignedAgentIdObj: { $toObjectId: "$assignedAgentId" },
            leadIdObj: { $toObjectId: "$leadId" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "assignedAgentIdObj",
            foreignField: "_id",
            as: "assignedAgent",
          },
        },
        {
          $lookup: {
            from: "leads",
            localField: "leadIdObj",
            foreignField: "_id",
            as: "lead",
          },
        },
      ]);

      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateFollowup(followupIds: string[], updateData: Partial<FollowUpType>): Promise<any> {
    try {
      console.log("Followup IDs:", updateData);
     const response = await Followup.updateMany({ _id: { $in: followupIds } }, { $set: updateData });
     console.log("Update Response:", response);
     return response
    } catch (error) {
      throw error;
    }
  }
}
