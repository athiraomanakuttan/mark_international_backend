import mongoose from 'mongoose'
import {  TransferModel } from '../model/leadTransfer'
import { LeadTransferType, TransferFetchType, TransferResponseType } from '../types/lead-transfer-type'
import { LeadFilterType } from '../types/leadTypes'
import {ITransferRepository} from './interface/ITransferRepository'
export class TransferRepository implements ITransferRepository{
    async createTransferHistory(transferData: LeadTransferType[]): Promise<any> {
        try {
            return await TransferModel.insertMany(transferData)
            
        } catch (error) {
            throw error
        }
    }
    async getTransferList(
  page: number,
  limit: number,
  filter: LeadFilterType,
  search: string
): Promise<TransferResponseType> {
  try {
    const skip = (page - 1) * limit;

    // Base match conditions
    const matchConditions: any = {};

    // Date range filter for transferDate
    if (filter.fromDate || filter.toDate) {
      matchConditions.transferDate = {};
      if (filter.fromDate) {
        matchConditions.transferDate.$gte = new Date(filter.fromDate);
      }
      if (filter.toDate) {
        matchConditions.transferDate.$lte = new Date(filter.toDate);
      }
    }

    // Staff filters
    if (filter.staff?.length) {
      matchConditions.toStaff = {
        $in: filter.staff.map(id => new mongoose.Types.ObjectId(id))
      };
    }

    if (filter.createBy?.length) {
      matchConditions.fromStaff = {
        $in: filter.createBy.map(id => new mongoose.Types.ObjectId(id))
      };
    }

    // Search by Lead name or phone (need lookup first to filter correctly)
    const searchMatch: any[] = [];
    if (search?.trim()) {
      searchMatch.push(
        { "leadData.name": { $regex: search, $options: "i" } },
        { "leadData.phoneNumber": { $regex: search, $options: "i" } }
      );
    }

    // Aggregation pipeline
    const transferList = await TransferModel.aggregate([
      { $match:matchConditions },
      {
        $lookup: {
          from: "leads",
          localField: "leadId",
          foreignField: "_id",
          as: "leadData"
        }
      },
      { $unwind: "$leadData" },
      {
        $lookup: {
          from: "users",
          localField: "fromStaff",
          foreignField: "_id",
          as: "fromStaffData"
        }
      },
      { $unwind: "$fromStaffData" },
      {
        $lookup: {
          from: "users",
          localField: "toStaff",
          foreignField: "_id",
          as: "toStaffData"
        }
      },
      { $unwind: "$toStaffData" },
      ...(searchMatch.length ? [{ $match: { $or: searchMatch } }] : []),
      { $sort: { transferDate: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalRecords = await TransferModel.countDocuments(matchConditions);
    return { transfers: transferList as TransferFetchType[], totalRecords };
  } catch (error) {
    throw error;
  }
}
 
}