import { ILeaveRepository, LeaveRepository } from '../repository/leaveRepository';
import { 
  CreateLeaveDto, 
  LeaveResponse, 
  LeaveFormErrors, 
  LeaveQueryFilters, 
  UpdateLeaveStatusDto,
  LeaveValidationResult,
  LeaveStats,
  MonthlyLeaveSummary
} from '../types/leaveTypes';
import { ILeave, LeaveStatus } from '../model/leaveModel';
import { cloudinary } from '../config/cloudinaryConfig';
import { UploadApiResponse } from 'cloudinary';

export interface ILeaveService {
  createLeave(leaveData: CreateLeaveDto, files?: Express.Multer.File[]): Promise<LeaveResponse>;
  getLeaveById(leaveId: string): Promise<ILeave | null>;
  updateLeaveStatus(leaveId: string, statusData: UpdateLeaveStatusDto): Promise<LeaveResponse>;
  deleteLeave(leaveId: string): Promise<boolean>;
  getLeavesByFilters(filters: LeaveQueryFilters): Promise<LeaveResponse>;
  getLeavesByUserId(userId: string, filters?: Partial<LeaveQueryFilters>): Promise<LeaveResponse>;
  getLeavesByStatus(status: LeaveStatus, filters?: Partial<LeaveQueryFilters>): Promise<LeaveResponse>;
  getLeavesByDateRange(dateFrom: string, dateTo: string, filters?: Partial<LeaveQueryFilters>): Promise<LeaveResponse>;
  getLeaveStats(): Promise<LeaveStats>;
  getMonthlyLeaveSummary(year: number): Promise<MonthlyLeaveSummary[]>;
}

export class LeaveService implements ILeaveService {
  private __leaveRepository: ILeaveRepository;

  constructor(leaveRepository: ILeaveRepository = new LeaveRepository()) {
    this.__leaveRepository = leaveRepository;
  }

  async createLeave(leaveData: CreateLeaveDto, files?: Express.Multer.File[]): Promise<LeaveResponse> {
    try {
      // Validate leave data
      const validation = this.validateLeaveData(leaveData);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        };
      }

      // Upload documents if provided
      let documentUrls: Array<{ title: string, url: string }> = [];
      if (files && files.length > 0) {
        try {
          documentUrls = await this.uploadFilesToCloudinary(files);
        } catch (uploadError) {
          console.error('Error uploading leave documents:', uploadError);
          return {
            success: false,
            message: 'Failed to upload documents'
          };
        }
      }

      // Create leave request
      const leavePayload: Partial<ILeave> = {
        userId: leaveData.userId as any,
        leaveDate: new Date(leaveData.leaveDate),
        reason: leaveData.reason,
        documents: documentUrls,
        status: LeaveStatus.PENDING
      };

      const savedLeave = await this.__leaveRepository.createLeave(leavePayload);

      return {
        success: true,
        message: 'Leave request created successfully',
        data: savedLeave
      };
    } catch (error) {
      console.error('Error creating leave request:', error);
      
      // Handle specific validation errors
      if (error instanceof Error) {
        if (error.message.includes('joining date')) {
          return {
            success: false,
            message: 'Leave date cannot be before joining date',
            errors: { leaveDate: error.message }
          };
        }
        if (error.message.includes('past')) {
          return {
            success: false,
            message: 'Leave date cannot be in the past',
            errors: { leaveDate: error.message }
          };
        }
      }

      return {
        success: false,
        message: 'Failed to create leave request'
      };
    }
  }

  async getLeaveById(leaveId: string): Promise<ILeave | null> {
    try {
      return await this.__leaveRepository.getLeaveById(leaveId);
    } catch (error) {
      throw error;
    }
  }

  async updateLeaveStatus(leaveId: string, statusData: UpdateLeaveStatusDto): Promise<LeaveResponse> {
    try {
      // Validate status
      if (!Object.values(LeaveStatus).includes(statusData.status)) {
        return {
          success: false,
          message: 'Invalid leave status',
          errors: { general: 'Status must be pending, approved, or rejected' }
        };
      }

      const updateData: Partial<ILeave> = {
        status: statusData.status
      };

      const updatedLeave = await this.__leaveRepository.updateLeave(leaveId, updateData);

      if (updatedLeave) {
        return {
          success: true,
          message: `Leave request ${statusData.status} successfully`,
          data: updatedLeave
        };
      } else {
        return {
          success: false,
          message: 'Leave request not found'
        };
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      return {
        success: false,
        message: 'Failed to update leave status'
      };
    }
  }

  async deleteLeave(leaveId: string): Promise<boolean> {
    try {
      return await this.__leaveRepository.deleteLeave(leaveId);
    } catch (error) {
      throw error;
    }
  }

  async getLeavesByFilters(filters: LeaveQueryFilters): Promise<LeaveResponse> {
    try {
      const result = await this.__leaveRepository.getLeavesByFilters(filters);
      
      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const totalPages = Math.ceil(result.total / limit);

      return {
        success: true,
        message: 'Leaves retrieved successfully',
        data: result.leaves,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error getting leaves by filters:', error);
      return {
        success: false,
        message: 'Failed to retrieve leaves'
      };
    }
  }

  async getLeavesByUserId(userId: string, filters: Partial<LeaveQueryFilters> = {}): Promise<LeaveResponse> {
    try {
      return await this.getLeavesByFilters({ ...filters, userId });
    } catch (error) {
      throw error;
    }
  }

  async getLeavesByStatus(status: LeaveStatus, filters: Partial<LeaveQueryFilters> = {}): Promise<LeaveResponse> {
    try {
      return await this.getLeavesByFilters({ ...filters, status });
    } catch (error) {
      throw error;
    }
  }

  async getLeavesByDateRange(dateFrom: string, dateTo: string, filters: Partial<LeaveQueryFilters> = {}): Promise<LeaveResponse> {
    try {
      return await this.getLeavesByFilters({ ...filters, dateFrom, dateTo });
    } catch (error) {
      throw error;
    }
  }

  async getLeaveStats(): Promise<LeaveStats> {
    try {
      return await this.__leaveRepository.getLeaveStats();
    } catch (error) {
      throw error;
    }
  }

  async getMonthlyLeaveSummary(year: number): Promise<MonthlyLeaveSummary[]> {
    try {
      return await this.__leaveRepository.getMonthlyLeaveSummary(year);
    } catch (error) {
      throw error;
    }
  }

  private validateLeaveData(data: CreateLeaveDto): LeaveValidationResult {
    const errors: LeaveFormErrors = {};

    // Validate userId
    if (!data.userId || data.userId.trim().length === 0) {
      errors.userId = 'User ID is required';
    }

    // Validate leaveDate
    if (!data.leaveDate) {
      errors.leaveDate = 'Leave date is required';
    } else {
      const leaveDate = new Date(data.leaveDate);
      if (isNaN(leaveDate.getTime())) {
        errors.leaveDate = 'Invalid date format';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        leaveDate.setHours(0, 0, 0, 0);
        
        if (leaveDate < today) {
          errors.leaveDate = 'Leave date cannot be in the past';
        }
      }
    }

    // Validate reason
    if (!data.reason || data.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters long';
    } else if (data.reason.trim().length > 500) {
      errors.reason = 'Reason cannot exceed 500 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private async uploadFilesToCloudinary(files: Express.Multer.File[]): Promise<Array<{ title: string, url: string }>> {
    const uploadPromises = files.map(async (file) => {
      return new Promise<{ title: string, url: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'leaves',
            use_filename: true,
            unique_filename: true
          },
          (error, result: UploadApiResponse | undefined) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else if (result) {
              resolve({
                title: file.originalname,
                url: result.secure_url
              });
            } else {
              reject(new Error('Upload failed - no result'));
            }
          }
        );
        
        uploadStream.end(file.buffer);
      });
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading leave documents:', error);
      throw new Error('Failed to upload documents');
    }
  }
}