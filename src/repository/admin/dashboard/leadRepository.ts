import { IDashboardLeadRepository } from "../../interface/admin/dashboard/IDashboardLeadRepository";
import { TransferModel } from "../../../model/leadTransfer";
import LeadModel from "../../../model/leadModel";

class DashboardLeadRepository implements IDashboardLeadRepository{

    async getDashboardLeadData(from:Date, to:Date) {
  try {
    const leadStats = await LeadModel.aggregate([
      {$match: {status: {$in :[1,2,3,4,5,6]}, createdAt: {$gte: from, $lte: to}}},
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ["$status", 1] }, 1, 0] } },
          followUp: { $sum: { $cond: [{ $eq: ["$status", 3] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $in: ["$status", [2, 6]] }, 1, 0] } },
          missed: { $sum: { $cond: [{ $in: ["$status", [4, 5]] }, 1, 0] } }
        }
      }
    ]);

    const transferredCount = await TransferModel.countDocuments();

    return {
      ...leadStats[0],
      transferred: transferredCount
    };

  } catch (error) {
    throw error;
  }
}

async getStaffWiseReport(fromDate: Date, toDate: Date): Promise<any> {
  try {
    console.log("from", fromDate, toDate)
    const data = await LeadModel.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate }
        }
      },
      {
        $group: {
          _id: { agent: "$assignedAgent", status: "$status" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.agent",
          new: { $sum: { $cond: [{ $eq: ["$_id.status", 1] }, "$count", 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$_id.status", 2] }, "$count", 0] } },
          followUp: { $sum: { $cond: [{ $eq: ["$_id.status", 3] }, "$count", 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$_id.status", 4] }, "$count", 0] } },
          closed: { $sum: { $cond: [{ $eq: ["$_id.status", 6] }, "$count", 0] } }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agentInfo"
        }
      },
      { 
        $unwind: { 
          path: "$agentInfo", 
          preserveNullAndEmptyArrays: true 
        } 
      },
      {
        $project: {
          _id: 0,
          name: { 
            $ifNull: ["$agentInfo.name", "Unassigned"] 
          },
          data: {
            "new lead": "$new",
            "pending lead": "$pending", 
            "followup lead": "$followUp",
            "rejected lead": "$rejected",
            "closed lead": "$closed"
          }
        }
      },
      { 
        $sort: { name: 1 } 
      }
    ]);
console.log("data======================================", data)
    // Calculate totals
    const totals = data.reduce(
      (acc, cur) => {
        acc.data["new lead"] += cur.data["new lead"] || 0;
        acc.data["pending lead"] += cur.data["pending lead"] || 0;
        acc.data["followup lead"] += cur.data["followup lead"] || 0;
        acc.data["rejected lead"] += cur.data["rejected lead"] || 0;
        acc.data["closed lead"] += cur.data["closed lead"] || 0;
        return acc;
      },
      { 
        name: "Total", 
        data: { 
          "new lead": 0, 
          "pending lead": 0, 
          "followup lead": 0, 
          "rejected lead": 0, 
          "closed lead": 0 
        } 
      }
    );

    // Calculate total leads count
    const totalLeadsCount = totals.data["new lead"] + 
                           totals.data["pending lead"] + 
                           totals.data["followup lead"] + 
                           totals.data["rejected lead"] + 
                           totals.data["closed lead"];

    return {
      totalLeads: totalLeadsCount,
      staffData: [...data, totals]
    };

  } catch (error) {
    throw error;
  }
}

async getMonthWiseReport(currentMonthStartDate: Date, currentDate: Date, prevMonthFirstDate: Date, prevMonthLastDate: Date): Promise<any> {
  try {
    //get the current month total lead count without status -1 and 0
    const currentMonthLeads = await LeadModel.countDocuments({
      createdAt: { $gte: currentMonthStartDate, $lte: currentDate },
      status: { $nin: [-1, 0] }
    });

    //get the previous month total lead count without status -1 and 0
    const prevMonthLeads = await LeadModel.countDocuments({
      createdAt: { $gte: prevMonthFirstDate, $lte: prevMonthLastDate },
      status: { $nin: [-1, 0] }
    });

    return {
      currentMonthLeads,
      prevMonthLeads
    };
  } catch (error) {
    throw error;
  }
}
}


export default DashboardLeadRepository