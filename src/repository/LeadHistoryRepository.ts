import mongoose from "mongoose";
import LeadHistory, { ILeadHistory} from "../model/leadHistoryModel";
import { ILeadHistoryRepository } from "./interface/ILeadHistoryRepository";

export class LeadHistoryRepository implements ILeadHistoryRepository {
    async createLeadHistory(data: ILeadHistory): Promise<ILeadHistory> {
       try{
            const leadHistory = new LeadHistory(data);
            await leadHistory.save();
            return leadHistory;
       }catch(err){ throw err} 
    }

async getLeadHistory(leadId: string, page: number, limit: number): Promise<any[]> {
  try {
    const skip = (page - 1) * limit;

    const leadHistory = await LeadHistory.aggregate([
      // Match by leadId
      { $match: { leadId: new mongoose.Types.ObjectId(leadId) } },

      // Lookup from user
      {
        $lookup: {
          from: "users",
          localField: "from",
          foreignField: "_id",
          as: "fromUser"
        }
      },
      { $unwind: { path: "$fromUser", preserveNullAndEmptyArrays: true } },

      // Lookup to user
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          as: "toUser"
        }
      },
      { $unwind: { path: "$toUser", preserveNullAndEmptyArrays: true } },

      // Lookup updatedBy user
      {
        $lookup: {
          from: "users",
          localField: "updatedBy",
          foreignField: "_id",
          as: "updatedByUser"
        }
      },
      { $unwind: { path: "$updatedByUser", preserveNullAndEmptyArrays: true } },

      // Lookup createdBy user
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdByUser"
        }
      },
      { $unwind: { path: "$createdByUser", preserveNullAndEmptyArrays: true } },

      // Format description dynamically
      {
        $addFields: {
          description: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$historyType", 1] }, // created
                  then: { $concat: ["Created by ", "$createdByUser.name"] }
                },
                {
                  case: { $eq: ["$historyType", 2] }, // updated
                  then: {
                    $concat: [
                      "Status updated to ",
                      { $toString: "$updatedStatus" },
                      " by ",
                      "$updatedByUser.name"
                    ]
                  }
                },
                {
                  case: { $eq: ["$historyType", 3] }, // deleted
                  then: { $concat: ["Deleted by ", "$deletedByUser.name"] }
                },
                {
                  case: { $eq: ["$historyType", 4] }, // transferred
                  then: {
                    $concat: [
                      "Transferred from ",
                      { $ifNull: ["$fromUser.name", "N/A"] },
                      " to ",
                      { $ifNull: ["$toUser.name", "N/A"] },
                      " by ",
                      "$updatedByUser.name"
                    ]
                  }
                }
              ],
              default: "History event"
            }
          }
        }
      },

      // Sort recent first
      { $sort: { createdAt: -1 } },

      // Pagination
      { $skip: skip },
      { $limit: limit },

      // Final projection
      {
        $project: {
          _id: 1,
          leadId: 1,
          historyType: 1,
          updatedStatus: 1,
          remark: 1,
          createdAt: 1,
          from: "$fromUser.name",
          to: "$toUser.name",
          updatedBy: "$updatedByUser.name",
          createdBy: "$createdByUser.name",
          description: 1
        }
      }
    ]);

    return leadHistory;
  } catch (err) {
    throw err;
  }
}


}

