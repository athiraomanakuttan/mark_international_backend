import mongoose from 'mongoose';
import Designation from '../model/designationModel';
import { IDesignationRepository } from './interface/IDesignationRepository';
import { DesignationBasicType, DesignationType, UpdateDesignationType, DesignationFilterType, DesignationResponseType } from '../types/designationTypes';

export class DesignationRepository implements IDesignationRepository {
  
  async createDesignation(designationData: DesignationBasicType): Promise<DesignationType> {
    try {
      const designation = new Designation(designationData);
      const savedDesignation = await designation.save();
      return await this.getDesignationWithCreatedBy(String(savedDesignation._id));
    } catch (error) {
      throw error;
    }
  }

  async getDesignations(page: number = 1, limit: number = 10, filterData: DesignationFilterType, search: string = ''): Promise<DesignationResponseType> {
    try {
      const skip = (page - 1) * limit;
      let query: any = {};

      // Apply filters
      if (filterData.status && filterData.status.length > 0) {
        query.status = { $in: filterData.status };
      }

      if (filterData.fromDate || filterData.toDate) {
        query.createdAt = {};
        if (filterData.fromDate) {
          query.createdAt.$gte = new Date(filterData.fromDate);
        }
        if (filterData.toDate) {
          query.createdAt.$lte = new Date(filterData.toDate);
        }
      }

      if (filterData.createdBy && filterData.createdBy.length > 0) {
        query.createdBy = { $in: filterData.createdBy.map(id => new mongoose.Types.ObjectId(id)) };
      }

      // Apply search
      if (search.trim()) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const designations = await Designation.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdByData',
            pipeline: [
              { $project: { name: 1 } }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);

      const totalRecords = await Designation.countDocuments(query);

      return {
        designations: designations as DesignationType[],
        totalRecords
      };
    } catch (error) {
      throw error;
    }
  }

  async getDesignationById(designationId: string): Promise<DesignationType | null> {
    try {
      return await this.getDesignationWithCreatedBy(designationId);
    } catch (error) {
      throw error;
    }
  }

  async updateDesignation(designationId: string, designationData: UpdateDesignationType): Promise<DesignationType | null> {
    try {
      await Designation.findByIdAndUpdate(designationId, designationData, { new: true });
      return await this.getDesignationWithCreatedBy(designationId);
    } catch (error) {
      throw error;
    }
  }

  async deleteDesignation(designationId: string): Promise<boolean> {
    try {
      const result = await Designation.findByIdAndDelete(designationId);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async checkDesignationExists(name: string, excludeId?: string): Promise<boolean> {
    try {
      const query: any = { 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      };
      
      if (excludeId) {
        query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
      }
      
      const designation = await Designation.findOne(query);
      return !!designation;
    } catch (error) {
      throw error;
    }
  }

  async getAllActiveDesignations(): Promise<DesignationType[]> {
    try {
      const designations = await Designation.aggregate([
        { $match: { status: 1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdByData',
            pipeline: [
              { $project: { name: 1 } }
            ]
          }
        },
        { $sort: { name: 1 } }
      ]);

      return designations as DesignationType[];
    } catch (error) {
      throw error;
    }
  }

  private async getDesignationWithCreatedBy(designationId: string): Promise<DesignationType> {
    const designation = await Designation.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(designationId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByData',
          pipeline: [
            { $project: { name: 1 } }
          ]
        }
      }
    ]);

    return designation[0] as DesignationType;
  }
}