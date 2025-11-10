import mongoose from 'mongoose';
import Termination from '../model/terminationModel';
import User from '../model/userModel';
import Employee from '../model/employeeModel';
import {
  TerminationBasicType,
  TerminationFullType,
  TerminationFilterType,
  TerminationListResponse,
  StaffEmployeeListItem
} from '../types/terminationTypes';

export class TerminationRepository {
  
  async createTermination(terminationData: TerminationBasicType): Promise<TerminationFullType> {
    try {
      const termination = new Termination(terminationData);
      const savedTermination = await termination.save();
      return await this.getTerminationWithRelations(String(savedTermination._id));
    } catch (error) {
      throw error;
    }
  }

  async getTerminations(
    page: number = 1,
    limit: number = 10,
    filter: TerminationFilterType = {}
  ): Promise<TerminationListResponse> {
    try {
      const skip = (page - 1) * limit;
      
      // Build match query
      const matchQuery: any = {};
      
      if (filter.type) {
        matchQuery.type = filter.type;
      }
      
      if (filter.search && filter.search.trim()) {
        matchQuery.$or = [
          { personName: { $regex: filter.search, $options: 'i' } },
          { reason: { $regex: filter.search, $options: 'i' } }
        ];
      }

      // Get terminations with user data
      const terminations = await Termination.aggregate([
        { $match: matchQuery },
        {
          $lookup: {
            from: 'users',
            localField: 'terminatedBy',
            foreignField: '_id',
            as: 'terminatedByData',
            pipeline: [
              { $project: { name: 1 } }
            ]
          }
        },
        { $sort: { terminatedAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);

      const totalCount = await Termination.aggregate([
        { $match: matchQuery },
        { $count: 'total' }
      ]);

      const totalRecords = totalCount[0]?.total || 0;

      return {
        terminations: terminations as TerminationFullType[],
        totalRecords
      };
    } catch (error) {
      throw error;
    }
  }

  async getTerminationById(terminationId: string): Promise<TerminationFullType | null> {
    try {
      return await this.getTerminationWithRelations(terminationId);
    } catch (error) {
      throw error;
    }
  }

  async getActiveStaff(): Promise<StaffEmployeeListItem[]> {
    try {
      const staff = await User.find(
        { 
          isActive: 1,
          role: 'staff'
        },
        {
          _id: 1,
          name: 1,
          email: 1,
          phoneNumber: 1,
          designation: 1,
          isActive: 1
        }
      ).sort({ name: 1 }).lean();

      return staff.map(s => ({
        _id: s._id.toString(),
        name: s.name,
        email: s.email,
        phoneNumber: s.phoneNumber,
        designation: s.designation,
        isActive: s.isActive
      })) as StaffEmployeeListItem[];
    } catch (error) {
      throw error;
    }
  }

  async getActiveEmployees(): Promise<StaffEmployeeListItem[]> {
    try {
      const employees = await Employee.find(
        { status: 1 },
        {
          _id: 1,
          name: 1,
          email: 1,
          phoneNumber: 1,
          designation: 1,
          status: 1
        }
      ).sort({ name: 1 }).lean();

      return employees.map(e => ({
        _id: e._id.toString(),
        name: e.name,
        email: e.email || '',
        phoneNumber: e.phoneNumber || '',
        designation: e.designation?.toString() || '',
        isActive: e.status || 1
      })) as StaffEmployeeListItem[];
    } catch (error) {
      throw error;
    }
  }

  async disableStaff(staffId: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndUpdate(
        staffId,
        { isActive: 0 },
        { new: true }
      );
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async disableEmployee(employeeId: string): Promise<boolean> {
    try {
      const result = await Employee.findByIdAndUpdate(
        employeeId,
        { status: 0 },
        { new: true }
      );
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  private async getTerminationWithRelations(terminationId: string): Promise<TerminationFullType> {
    const termination = await Termination.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(terminationId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'terminatedBy',
          foreignField: '_id',
          as: 'terminatedByData',
          pipeline: [
            { $project: { name: 1 } }
          ]
        }
      }
    ]);

    return termination[0] as TerminationFullType;
  }
}
