import mongoose from 'mongoose';
import Resignation from '../model/resignationModel';
import { 
  ResignationBasicType, 
  ResignationType, 
  ResignationFilterType, 
  ResignationResponseType,
  ApproveRejectResignationType,
  ResignationStatsType,
  UpdateResignationType
} from '../types/resignationTypes';
import { IResignationRepository } from './interface/IResignationRepository';

export class ResignationRepository implements IResignationRepository {
  
  async createResignation(resignationData: ResignationBasicType): Promise<ResignationType> {
    try {
      const resignation = new Resignation(resignationData);
      const savedResignation = await resignation.save();
      return await this.getResignationWithRelations(String(savedResignation._id));
    } catch (error) {
      throw error;
    }
  }

  async getResignationById(resignationId: string): Promise<ResignationType | null> {
    try {
      return await this.getResignationWithRelations(resignationId);
    } catch (error) {
      throw error;
    }
  }

  async getResignationsByStaffId(staffId: string): Promise<ResignationType[]> {
    try {
      const resignations = await Resignation.aggregate([
        { $match: { staffId: new mongoose.Types.ObjectId(staffId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'staffId',
            foreignField: '_id',
            as: 'staffData',
            pipeline: [
              { $project: { name: 1, email: 1 } }
            ]
          }
        },
        { $sort: { createdAt: -1 } }
      ]);

      return resignations as ResignationType[];
    } catch (error) {
      throw error;
    }
  }

  async getResignations(page: number = 1, limit: number = 10, status: number = 0, search: string = ''): Promise<ResignationResponseType | null> {
    try {
      const skip = (page - 1) * limit;
      
      // Build match query
      const matchQuery: any = {};
      if (status !== undefined && status !== null) {
        matchQuery.status = status;
      }
      if (search && search.trim()) {
        matchQuery.reason = { $regex: search, $options: 'i' };
      }

      console.log('🔍 Repository: Match query:', matchQuery);
      
      // Get resignations with user data (staff are users, not employees)
      const resignations = await Resignation.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: 'users',
            localField: 'staffId',
            foreignField: '_id',
            as: 'staffData',
            pipeline: [
              { $project: { name: 1, email: 1 } }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);

      console.log(`📊 Repository: Fetched ${resignations.length} resignations`);
      if (resignations.length > 0) {
        console.log('📊 Sample resignation:', {
          id: resignations[0]._id,
          staffId: resignations[0].staffId,
          staffDataLength: resignations[0].staffData?.length,
          userName: resignations[0].staffData?.[0]?.name || 'Unknown',
          userEmail: resignations[0].staffData?.[0]?.email || 'N/A'
        });
      }
      
      const totalCount = await Resignation.aggregate([
        { $match: matchQuery },
        { $count: 'total' }
      ]);

      const totalRecords = totalCount[0]?.total || 0;
      console.log(`📊 Repository: Total records: ${totalRecords}`);

      return {
        resignations: resignations as ResignationType[],
        totalRecords
      };
    } catch (error) {
      console.error('❌ Repository error:', error);
      throw error;
    }
  }

  async updateResignation(resignationId: string, resignationData: UpdateResignationType): Promise<ResignationType | null> {
    try {
      await Resignation.findByIdAndUpdate(resignationId, resignationData, { new: true });
      return await this.getResignationWithRelations(resignationId);
    } catch (error) {
      throw error;
    }
  }

  async approveOrRejectResignation(resignationId: string, updateData: ApproveRejectResignationType): Promise<ResignationType | null> {
    try {
      const updateFields: any = {
        status: updateData.status,
        adminComments: updateData.adminComments || ''
      };

      if (updateData.status === 1) {
        updateFields.approvedBy = new mongoose.Types.ObjectId(String(updateData.adminId));
        updateFields.rejectedBy = undefined;
      } else if (updateData.status === 2) {
        updateFields.rejectedBy = new mongoose.Types.ObjectId(String(updateData.adminId));
        updateFields.approvedBy = undefined;
      }

      await Resignation.findByIdAndUpdate(resignationId, updateFields, { new: true });
      return await this.getResignationWithRelations(resignationId);
    } catch (error) {
      throw error;
    }
  }

  async deleteResignation(resignationId: string): Promise<boolean> {
    try {
      const result = await Resignation.findByIdAndDelete(resignationId);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getResignationStats(): Promise<ResignationStatsType> {
    try {
      const stats = await Resignation.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const result: ResignationStatsType = {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
      };

      stats.forEach(stat => {
        switch (stat._id) {
          case 0:
            result.pending = stat.count;
            break;
          case 1:
            result.approved = stat.count;
            break;
          case 2:
            result.rejected = stat.count;
            break;
        }
      });

      result.total = result.pending + result.approved + result.rejected;
      return result;
    } catch (error) {
      throw error;
    }
  }

  private async getResignationWithRelations(resignationId: string): Promise<ResignationType> {
    const resignation = await Resignation.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(resignationId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'staffId',
          foreignField: '_id',
          as: 'staffData',
          pipeline: [
            { $project: { name: 1, email: 1 } }
          ]
        }
      }
    ]);

    return resignation[0] as ResignationType;
  }
}