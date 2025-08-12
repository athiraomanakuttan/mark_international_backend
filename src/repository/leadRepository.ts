import { ILeadRepository } from "./interface/ILeadRepository";
import Lead from "../model/leadModel";
import { BulkLeadTransformType, BulkLeadType, LeadBasicType, LeadFilterType, LeadresponseType, LeadType, UpdatedLeadType } from "../types/leadTypes";
import mongoose from "mongoose";
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
  // repository
async getLeadByStatus(
  status: number,
  page: number,
  limit: number,
  filterData: LeadFilterType,
  search: string
): Promise<LeadresponseType> {
  try {
    const skip = (page - 1) * limit;
    let statusArr: number[] = [];

    if (status === 7) statusArr = [1, 2, 3, 4, 5, 6];
    else statusArr = [status];

    // Base match condition
    const matchConditions: any = { status: { $in: statusArr } };

    // Apply date range filter
    if (filterData.fromDate || filterData.toDate) {
      matchConditions.createdAt = {};
      if (filterData.fromDate) {
        matchConditions.createdAt.$gte = new Date(filterData.fromDate);
      }
      if (filterData.toDate) {
        matchConditions.createdAt.$lte = new Date(filterData.toDate);
      }
    }

    // Apply array-based filters
    if (filterData.leadCategory?.length) {
      matchConditions.leadCategory = { $in: filterData.leadCategory };
    }
    if (filterData.leadStatus?.length) {
      matchConditions.status = { $in: filterData.leadStatus };
    }
    if (filterData.priority?.length) {
      matchConditions.priority = { $in: filterData.priority };
    }
    if (filterData.leadSource?.length) {
      matchConditions.leadSource = { $in: filterData.leadSource };
    }
    if (filterData.staff?.length) {
    matchConditions.assignedAgent = {
    $in: filterData.staff.map(id => new mongoose.Types.ObjectId(id))
  };
  }

    if (filterData.createBy?.length) {
  matchConditions.createdBy = {
    $in: filterData.createBy.map(id => new mongoose.Types.ObjectId(id))
  };
}

    if (search?.trim()) {
      matchConditions.$or = [
        { name: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } }
      ];
    }
    console.log("matchConditions", matchConditions)
    const leadList = await Lead.aggregate([
      { $match: matchConditions },
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
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalRecords = await Lead.countDocuments(matchConditions);
    return { lead: leadList as LeadType[], totalRecords };
  } catch (error) {
    throw error;
  }
}

async createBulkLead(leadData: BulkLeadTransformType[]): Promise<any> {
  try {
    const response =  await Lead.insertMany(leadData)
    return response
  } catch (error) {
    throw error
  }
}
async transferLead(staffId: string, leadData: string[]): Promise<any> {
  try {
    const updatedData = await Lead.updateMany({_id:{$in: leadData}},{$set:{assignedAgent: staffId}})
    console.log("updatedData",updatedData)
    return updatedData
  } catch (error) {
    throw error
  }
}

async deleteMultipleLeads(status: number, leadData: string[]): Promise<any> {
  try {
    const response = await Lead.updateMany({_id:{$in:leadData}},{$set:{status} })
    return response
  } catch (error) {
    throw error
  }
}

  // Placeholder methods for future implementation
  // async getLeadById(leadId: string): Promise<any> {
  //     return { success: true, data: { id: leadId } };
  // }

  async updateLead(leadId: string, leadData: UpdatedLeadType): Promise<any> {
      try {
        const response = await Lead.updateOne({_id:leadId},leadData)
        return response
      } catch (error) {
        throw error
      }
  }


  // async deleteLead(leadId: string): Promise<any> {
  //     return { success: true, message: `Lead ${leadId} deleted` };
  // }
}
