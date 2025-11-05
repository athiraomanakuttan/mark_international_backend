import { LeaveModel, ILeave, LeaveStatus } from '../model/leaveModel';
import { LeaveQueryFilters, LeaveStats, MonthlyLeaveSummary } from '../types/leaveTypes';

export interface ILeaveRepository {
  createLeave(leaveData: Partial<ILeave>): Promise<ILeave>;
  getLeaveById(leaveId: string): Promise<ILeave | null>;
  updateLeave(leaveId: string, updateData: Partial<ILeave>): Promise<ILeave | null>;
  deleteLeave(leaveId: string): Promise<boolean>;
  getLeavesByFilters(filters: LeaveQueryFilters): Promise<{ leaves: ILeave[], total: number }>;
  getLeavesByUserId(userId: string, filters?: Partial<LeaveQueryFilters>): Promise<{ leaves: ILeave[], total: number }>;
  getLeavesByStatus(status: LeaveStatus, filters?: Partial<LeaveQueryFilters>): Promise<{ leaves: ILeave[], total: number }>;
  getLeavesByDateRange(dateFrom: Date, dateTo: Date, filters?: Partial<LeaveQueryFilters>): Promise<{ leaves: ILeave[], total: number }>;
  getLeaveStats(): Promise<LeaveStats>;
  getMonthlyLeaveSummary(year: number): Promise<MonthlyLeaveSummary[]>;
  getUserLeaveCount(userId: string, year: number): Promise<number>;
}

export class LeaveRepository implements ILeaveRepository {
  
  async createLeave(leaveData: Partial<ILeave>): Promise<ILeave> {
    try {
      const leave = new LeaveModel(leaveData);
      return await leave.save();
    } catch (error) {
      throw error;
    }
  }

  async getLeaveById(leaveId: string): Promise<ILeave | null> {
    try {
      return await LeaveModel.findById(leaveId)
        .populate('userId', 'name email employeeId joiningDate')
        .exec();
    } catch (error) {
      throw error;
    }
  }

  async updateLeave(leaveId: string, updateData: Partial<ILeave>): Promise<ILeave | null> {
    try {
      return await LeaveModel.findByIdAndUpdate(
        leaveId,
        updateData,
        { new: true, runValidators: true }
      ).populate('userId', 'name email employeeId joiningDate');
    } catch (error) {
      throw error;
    }
  }

  async deleteLeave(leaveId: string): Promise<boolean> {
    try {
      const result = await LeaveModel.findByIdAndDelete(leaveId);
      return result !== null;
    } catch (error) {
      throw error;
    }
  }

  async getLeavesByFilters(filters: LeaveQueryFilters): Promise<{ leaves: ILeave[], total: number }> {
    try {
      const query: any = {};
      
      // Build query filters
      if (filters.userId) {
        query.userId = filters.userId;
      }
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.dateFrom || filters.dateTo) {
        query.leaveDate = {};
        if (filters.dateFrom) {
          query.leaveDate.$gte = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          query.leaveDate.$lte = new Date(filters.dateTo);
        }
      }

      // Pagination
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      // Sorting
      const sortBy = filters.sortBy || 'createdAt';
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder as 1 | -1 };

      // Execute queries
      const [leaves, total] = await Promise.all([
        LeaveModel.find(query)
          .populate('userId', 'name email employeeId joiningDate')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),
        LeaveModel.countDocuments(query)
      ]);

      return { leaves, total };
    } catch (error) {
      throw error;
    }
  }

  async getLeavesByUserId(userId: string, filters: Partial<LeaveQueryFilters> = {}): Promise<{ leaves: ILeave[], total: number }> {
    try {
      return await this.getLeavesByFilters({ ...filters, userId });
    } catch (error) {
      throw error;
    }
  }

  async getLeavesByStatus(status: LeaveStatus, filters: Partial<LeaveQueryFilters> = {}): Promise<{ leaves: ILeave[], total: number }> {
    try {
      return await this.getLeavesByFilters({ ...filters, status });
    } catch (error) {
      throw error;
    }
  }

  async getLeavesByDateRange(dateFrom: Date, dateTo: Date, filters: Partial<LeaveQueryFilters> = {}): Promise<{ leaves: ILeave[], total: number }> {
    try {
      return await this.getLeavesByFilters({
        ...filters,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString()
      });
    } catch (error) {
      throw error;
    }
  }

  async getLeaveStats(): Promise<LeaveStats> {
    try {
      const [totalRequests, pendingRequests, approvedRequests, rejectedRequests, upcomingLeaves] = await Promise.all([
        LeaveModel.countDocuments({}),
        LeaveModel.countDocuments({ status: LeaveStatus.PENDING }),
        LeaveModel.countDocuments({ status: LeaveStatus.APPROVED }),
        LeaveModel.countDocuments({ status: LeaveStatus.REJECTED }),
        LeaveModel.countDocuments({
          status: LeaveStatus.APPROVED,
          leaveDate: { $gte: new Date() }
        })
      ]);

      return {
        totalRequests,
        pendingRequests,
        approvedRequests,
        rejectedRequests,
        upcomingLeaves
      };
    } catch (error) {
      throw error;
    }
  }

  async getMonthlyLeaveSummary(year: number): Promise<MonthlyLeaveSummary[]> {
    try {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);

      const pipeline = [
        {
          $match: {
            leaveDate: { $gte: startDate, $lt: endDate }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$leaveDate' },
              year: { $year: '$leaveDate' },
              status: '$status'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: {
              month: '$_id.month',
              year: '$_id.year'
            },
            totalLeaves: { $sum: '$count' },
            approvedLeaves: {
              $sum: {
                $cond: [{ $eq: ['$_id.status', LeaveStatus.APPROVED] }, '$count', 0]
              }
            },
            pendingLeaves: {
              $sum: {
                $cond: [{ $eq: ['$_id.status', LeaveStatus.PENDING] }, '$count', 0]
              }
            },
            rejectedLeaves: {
              $sum: {
                $cond: [{ $eq: ['$_id.status', LeaveStatus.REJECTED] }, '$count', 0]
              }
            }
          }
        },
        {
          $sort: { '_id.month': 1 as 1 }
        }
      ];

      const results = await LeaveModel.aggregate(pipeline);
      
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      return results.map(result => ({
        month: months[result._id.month - 1],
        year: result._id.year,
        totalLeaves: result.totalLeaves,
        approvedLeaves: result.approvedLeaves,
        pendingLeaves: result.pendingLeaves,
        rejectedLeaves: result.rejectedLeaves
      }));
    } catch (error) {
      throw error;
    }
  }

  async getUserLeaveCount(userId: string, year: number): Promise<number> {
    try {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);

      return await LeaveModel.countDocuments({
        userId,
        leaveDate: { $gte: startDate, $lt: endDate },
        status: { $in: [LeaveStatus.APPROVED, LeaveStatus.PENDING] }
      });
    } catch (error) {
      throw error;
    }
  }
}