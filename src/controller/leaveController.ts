import { Request, Response } from 'express';
import { ILeaveService } from '../service/leaveService';
import { STATUS_CODE } from '../constance/statusCode';
import { MESSAGE_CONST } from '../constant/MessageConst';
import { CreateLeaveDto, UpdateLeaveStatusDto, LeaveQueryFilters } from '../types/leaveTypes';
import { LeaveStatus } from '../model/leaveModel';

export class LeaveController {
  private __leaveService: ILeaveService;

  constructor(leaveService: ILeaveService) {
    this.__leaveService = leaveService;
  }

  async createLeave(req: Request, res: Response): Promise<void> {
    try {
      // Extract leave data from request body
      const leaveData: CreateLeaveDto = {
        userId: req.body.userId,
        leaveDate: req.body.leaveDate,
        reason: req.body.reason
      };

      // Extract uploaded files (if any)
      const files = req.files as Express.Multer.File[] | undefined;
      const leaveFiles = files ? files.filter(f => f.fieldname && f.fieldname.includes('documents')) : [];

      // Create leave request
      const result = await this.__leaveService.createLeave(leaveData, leaveFiles);

      if (result.success) {
        res.status(STATUS_CODE.CREATED).json(result);
      } else {
        res.status(STATUS_CODE.BAD_REQUEST).json(result);
      }
    } catch (error) {
      console.error('Leave creation error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getLeaveById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Leave ID is required'
        });
        return;
      }

      const leave = await this.__leaveService.getLeaveById(id);

      if (leave) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Leave request found',
          data: leave
        });
      } else {
        res.status(STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: 'Leave request not found'
        });
      }
    } catch (error) {
      console.error('Get leave error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async updateLeaveStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, adminComments } = req.body;

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Leave ID is required'
        });
        return;
      }

      if (!status || !Object.values(LeaveStatus).includes(status)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Valid status is required (pending, approved, rejected)'
        });
        return;
      }

      const statusData: UpdateLeaveStatusDto = {
        status,
        adminComments
      };

      const result = await this.__leaveService.updateLeaveStatus(id, statusData);

      if (result.success) {
        res.status(STATUS_CODE.OK).json(result);
      } else {
        res.status(STATUS_CODE.BAD_REQUEST).json(result);
      }
    } catch (error) {
      console.error('Update leave status error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async deleteLeave(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Leave ID is required'
        });
        return;
      }

      const deleted = await this.__leaveService.deleteLeave(id);

      if (deleted) {
        res.status(STATUS_CODE.OK).json({
          success: true,
          message: 'Leave request deleted successfully'
        });
      } else {
        res.status(STATUS_CODE.NOT_FOUND).json({
          success: false,
          message: 'Leave request not found'
        });
      }
    } catch (error) {
      console.error('Delete leave error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getAllLeaves(req: Request, res: Response): Promise<void> {
    try {
      const filters: LeaveQueryFilters = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      // Add optional filters
      if (req.query.userId) filters.userId = req.query.userId as string;
      if (req.query.status) filters.status = req.query.status as LeaveStatus;
      if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom as string;
      if (req.query.dateTo) filters.dateTo = req.query.dateTo as string;

      const result = await this.__leaveService.getLeavesByFilters(filters);
      res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
      console.error('Get all leaves error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getLeavesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const filters: Partial<LeaveQueryFilters> = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      // Add optional filters
      if (req.query.status) filters.status = req.query.status as LeaveStatus;
      if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom as string;
      if (req.query.dateTo) filters.dateTo = req.query.dateTo as string;

      const result = await this.__leaveService.getLeavesByUserId(userId, filters);
      res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
      console.error('Get leaves by user ID error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getLeavesByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.params;
      
      if (!status || !Object.values(LeaveStatus).includes(status as LeaveStatus)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Valid status is required (pending, approved, rejected)'
        });
        return;
      }

      const filters: Partial<LeaveQueryFilters> = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as any) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      // Add optional filters
      if (req.query.userId) filters.userId = req.query.userId as string;
      if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom as string;
      if (req.query.dateTo) filters.dateTo = req.query.dateTo as string;

      const result = await this.__leaveService.getLeavesByStatus(status as LeaveStatus, filters);
      res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
      console.error('Get leaves by status error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getLeavesByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { dateFrom, dateTo } = req.query;
      
      if (!dateFrom || !dateTo) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Both dateFrom and dateTo are required'
        });
        return;
      }

      // Validate dates
      const fromDate = new Date(dateFrom as string);
      const toDate = new Date(dateTo as string);
      
      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD format'
        });
        return;
      }

      if (fromDate > toDate) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'dateFrom cannot be greater than dateTo'
        });
        return;
      }

      const filters: Partial<LeaveQueryFilters> = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as any) || 'leaveDate',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc'
      };

      // Add optional filters
      if (req.query.userId) filters.userId = req.query.userId as string;
      if (req.query.status) filters.status = req.query.status as LeaveStatus;

      const result = await this.__leaveService.getLeavesByDateRange(
        dateFrom as string, 
        dateTo as string, 
        filters
      );
      res.status(STATUS_CODE.OK).json(result);
    } catch (error) {
      console.error('Get leaves by date range error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getLeaveStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.__leaveService.getLeaveStats();
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Leave statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get leave stats error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }

  async getMonthlyLeaveSummary(req: Request, res: Response): Promise<void> {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      
      if (year < 2000 || year > 2100) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          message: 'Invalid year. Must be between 2000 and 2100'
        });
        return;
      }

      const summary = await this.__leaveService.getMonthlyLeaveSummary(year);
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Monthly leave summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      console.error('Get monthly leave summary error:', error);
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGE_CONST.INTERNAL_SERVER_ERROR
      });
    }
  }
}