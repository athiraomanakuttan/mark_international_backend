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
      console.log("currentDate==========", currentDate);
      const matchCondition: any = {
        isDeleted: false,
        followup_date: currentDate,
      };
      if (userId) {
        matchCondition["assignedAgentId"] = userId;
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
}
