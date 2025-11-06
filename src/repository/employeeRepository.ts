import mongoose from 'mongoose';
import Employee from '../model/employeeModel';
import { IEmployeeRepository } from './interface/IEmployeeRepository';
import { EmployeeBasicType, EmployeeType, UpdateEmployeeType, EmployeeFilterType, EmployeeResponseType } from '../types/employeeTypes';

export class EmployeeRepository implements IEmployeeRepository {
  
  async createEmployee(employeeData: EmployeeBasicType): Promise<EmployeeType> {
    try {
      const employee = new Employee(employeeData);
      const savedEmployee = await employee.save();
      return await this.getEmployeeWithRelations(String(savedEmployee._id));
    } catch (error) {
      throw error;
    }
  }

  async getEmployees(page: number = 1, limit: number = 10, filterData: EmployeeFilterType, search: string = ''): Promise<EmployeeResponseType> {
    try {
      const skip = (page - 1) * limit;
      let query: any = {};

      // Apply filters
      if (filterData.status && filterData.status.length > 0) {
        query.status = { $in: filterData.status };
      }

      if (filterData.designation && filterData.designation.length > 0) {
        query.designation = { $in: filterData.designation.map(id => new mongoose.Types.ObjectId(id)) };
      }

      if (filterData.fromDate || filterData.toDate) {
        query.dateOfJoining = {};
        if (filterData.fromDate) {
          query.dateOfJoining.$gte = new Date(filterData.fromDate);
        }
        if (filterData.toDate) {
          query.dateOfJoining.$lte = new Date(filterData.toDate);
        }
      }

      if (filterData.createdBy && filterData.createdBy.length > 0) {
        query.createdBy = { $in: filterData.createdBy.map(id => new mongoose.Types.ObjectId(id)) };
      }

      // Apply search
      if (search.trim()) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } }
        ];
      }

      const employees = await Employee.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'designations',
            localField: 'designation',
            foreignField: '_id',
            as: 'designationData',
            pipeline: [
              { $project: { name: 1 } }
            ]
          }
        },
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

      const totalRecords = await Employee.countDocuments(query);

      return {
        employees: employees as EmployeeType[],
        totalRecords
      };
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeType | null> {
    try {
      return await this.getEmployeeWithRelations(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(employeeId: string, employeeData: UpdateEmployeeType): Promise<EmployeeType | null> {
    try {
      await Employee.findByIdAndUpdate(employeeId, employeeData, { new: true });
      return await this.getEmployeeWithRelations(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(employeeId: string): Promise<boolean> {
    try {
      const result = await Employee.findByIdAndDelete(employeeId);
      return !!result;
    } catch (error) {
      throw error;
    }
  }



  async checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
    try {
      const query: any = { 
        email: email.toLowerCase() 
      };
      
      if (excludeId) {
        query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
      }
      
      const employee = await Employee.findOne(query);
      return !!employee;
    } catch (error) {
      throw error;
    }
  }

  async getAllActiveEmployees(): Promise<EmployeeType[]> {
    try {
      const employees = await Employee.aggregate([
        { $match: { status: 1 } },
        {
          $lookup: {
            from: 'designations',
            localField: 'designation',
            foreignField: '_id',
            as: 'designationData',
            pipeline: [
              { $project: { name: 1 } }
            ]
          }
        },
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

      return employees as EmployeeType[];
    } catch (error) {
      throw error;
    }
  }

  private async getEmployeeWithRelations(employeeId: string): Promise<EmployeeType> {
    const employee = await Employee.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(employeeId) } },
      {
        $lookup: {
          from: 'designations',
          localField: 'designation',
          foreignField: '_id',
          as: 'designationData',
          pipeline: [
            { $project: { name: 1 } }
          ]
        }
      },
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

    return employee[0] as EmployeeType;
  }
}