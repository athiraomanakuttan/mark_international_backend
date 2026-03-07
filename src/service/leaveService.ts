import {
  CreateLeaveDto,
  LeaveResponse,
  LeaveFormErrors,
  LeaveQueryFilters,
  UpdateLeaveStatusDto,
  LeaveValidationResult,
  LeaveStats,
  MonthlyLeaveSummary,
  DateRangeAttendanceStats,
  AllStaffAttendanceResponse,
  StaffAttendanceData,
  DailyAttendanceStatus,
  StaffLeaveReport,
  LeaveReportItem,
  MonthlyLeaveConfig,
  LeaveType,
} from '../types/leaveTypes';
import { ILeave, LeaveModel, LeaveStatus, LeaveType as LeaveTypeModel } from '../model/leaveModel';
import { ManualAbsenceModel } from '../model/manualAbsenceModel';
import { MonthlyLeaveConfigModel } from '../model/monthlyLeaveConfigModel';
import User from '../model/userModel';
import { cloudinary } from '../config/cloudinaryConfig';
import { UploadApiResponse } from 'cloudinary';
import { ILeaveRepository } from '../repository/interface/ILeaveRepository';
import { LeaveRepository } from '../repository/leaveRepository';
import { ILeaveService } from './interface/ILeaveService';
import { mapToAllStaffAttendanceResponseDto } from '../dto/dtoMapper/leaveDtoMapper';
import { AllStaffAttendanceResponseDto } from '../dto/dtoTypes/leaveDto';

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
        status: LeaveStatus.PENDING,
        leaveType: (leaveData.leaveType as LeaveTypeModel | undefined) ?? LeaveTypeModel.LOP,
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

      // When approving, enforce monthly leave quotas and leaveType conversions
      if (statusData.status === LeaveStatus.APPROVED) {
        const existingLeave = await this.__leaveRepository.getLeaveById(leaveId);
        if (!existingLeave) {
          return {
            success: false,
            message: 'Leave request not found'
          };
        }

        const leaveDate = new Date(existingLeave.leaveDate);
        const year = leaveDate.getFullYear();
        const month = leaveDate.getMonth() + 1;

        let requestedType: LeaveTypeModel =
          (existingLeave.leaveType as LeaveTypeModel | undefined) ?? LeaveTypeModel.LOP;

        let autoConvertedToLop = false;

        console.log('[LeaveService.updateLeaveStatus] Approving leave', {
          leaveId,
          userId: existingLeave.userId,
          leaveDate: leaveDate.toISOString().split('T')[0],
          currentLeaveType: existingLeave.leaveType,
        });

        if (requestedType === LeaveTypeModel.CASUAL || requestedType === LeaveTypeModel.SICK) {
          const config = await this.getMonthlyLeaveConfig(year, month);
          const limit =
            requestedType === LeaveTypeModel.CASUAL
              ? config.casualLimit
              : config.sickLimit;

          console.log('[LeaveService.updateLeaveStatus] Quota config', {
            year,
            month,
            requestedType,
            limit,
          });

          if (limit <= 0) {
            requestedType = LeaveTypeModel.LOP;
            autoConvertedToLop = true;
          } else {
            const monthStart = new Date(year, month - 1, 1);
            const monthEnd = new Date(year, month, 0);

            const approvedCount = await this.__leaveRepository.getLeavesByDateRange(
              monthStart,
              monthEnd,
              {
                userId: (existingLeave.userId as any)._id ?? existingLeave.userId,
                status: LeaveStatus.APPROVED,
                leaveType: requestedType,
              } as any
            ).then((r) => r.leaves.length);

            console.log('[LeaveService.updateLeaveStatus] Existing approved count for type', {
              requestedType,
              approvedCount,
              limit,
            });

            if (approvedCount >= limit) {
              requestedType = LeaveTypeModel.LOP;
              autoConvertedToLop = true;
            }
          }
        }

        const updateData: Partial<ILeave> = {
          status: LeaveStatus.APPROVED,
          leaveType: requestedType,
        };
        if (statusData.adminComments) {
          updateData.adminComments = statusData.adminComments.trim();
        }

        const updatedLeave = await this.__leaveRepository.updateLeave(leaveId, updateData);

        if (updatedLeave) {
          return {
            success: true,
            message: `Leave request approved successfully`,
            data: updatedLeave,
            ...(autoConvertedToLop && {
              autoConvertedToLop: true,
              originalType: existingLeave.leaveType as LeaveType,
            }),
          };
        } else {
          return {
            success: false,
            message: 'Leave request not found'
          };
        }
      }

      // For non-approval status changes, keep existing behaviour
      const updateData: Partial<ILeave> = {
        status: statusData.status
      };
      if (statusData.status === LeaveStatus.REJECTED && statusData.adminComments) {
        updateData.adminComments = statusData.adminComments.trim();
      }

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

  async getLeavesByDateRange(dateFrom: string, dateTo: string, filters: Partial<LeaveQueryFilters> = {}): Promise<DateRangeAttendanceStats> {
    try {
      // Get all leaves in the date range with high limit for accurate calculation
      const leaveData = await this.__leaveRepository.getLeavesByFilters({
        ...filters,
        dateFrom,
        dateTo,
        limit: 1000 // Get all leaves in range for accurate calculation
      });

      const { leaves, total } = leaveData;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

      // Per-type approved leave counts in range (for quotas and reporting)
      let casualLeaves = 0;
      let sickLeaves = 0;
      let lopLeaves = 0;
      leaves.forEach((leave) => {
        if (leave.status === LeaveStatus.APPROVED) {
          const type = (leave.leaveType as LeaveTypeModel | undefined) ?? LeaveTypeModel.LOP;
          switch (type) {
            case LeaveTypeModel.CASUAL:
              casualLeaves++;
              break;
            case LeaveTypeModel.SICK:
              sickLeaves++;
              break;
            case LeaveTypeModel.LOP:
            default:
              lopLeaves++;
              break;
          }
        }
      });
      console.log('[LeaveService.getLeavesByDateRange] Per-type approved counts', {
        userId: filters.userId,
        dateFrom,
        dateTo,
        casualLeaves,
        sickLeaves,
        lopLeaves,
      });

      // Fetch manual absences when viewing a specific user's attendance
      let manualAbsentDates = new Set<string>();
      if (filters.userId) {
      const manualAbsences = await ManualAbsenceModel.find({
        userId: filters.userId,
        date: { $gte: dateFrom, $lte: dateTo }
      }).lean();
      manualAbsentDates = new Set(manualAbsences.map((ma: any) => ma.date));
      }

      // Create a map of leave requests by date for efficient lookup
      const leaveMap = new Map<string, ILeave>();
      leaves.forEach(leave => {
        const leaveDate = new Date(leave.leaveDate);
        leaveDate.setHours(0, 0, 0, 0);
        leaveMap.set(leaveDate.toDateString(), leave);
      });

      // Calculate statistics
      let presentDays = 0;
      let absentDays = 0;
      let pendingLeaves = 0;
      let approvedLeaves = 0;
      let pastDays = 0;
      let upcomingDays = 0;

      // Iterate through each day in the range
      const startDate = new Date(dateFrom);
      const endDate = new Date(dateTo);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const totalWorkingDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toDateString();
        const dateKey = date.toISOString().split('T')[0];
        const leave = leaveMap.get(dateString);
        const isPastDay = date < currentDate;
        const isUpcomingDay = date >= currentDate;
        const isManualAbsent = filters.userId && manualAbsentDates.has(dateKey);

        if (isPastDay) {
          pastDays++;
        } else {
          upcomingDays++;
        }

        if (leave) {
          switch (leave.status) {
            case LeaveStatus.APPROVED:
              if (isPastDay) {
                absentDays++;
              } else {
                approvedLeaves++;
              }
              break;
            case LeaveStatus.PENDING:
              if (isPastDay) {
                if (isManualAbsent) {
                  absentDays++;
                } else {
                  presentDays++; // Pending request for past day = present
                }
              } else {
                pendingLeaves++;
              }
              break;
            case LeaveStatus.REJECTED:
              if (isPastDay) {
                if (isManualAbsent) {
                  absentDays++;
                } else {
                  presentDays++; // Rejected request for past day = present
                }
              }
              break;
            default:
              if (isPastDay) {
                if (isManualAbsent) {
                  absentDays++;
                } else {
                  presentDays++;
                }
              }
              break;
          }
        } else {
          // No leave request - check manual absence (admin-marked)
          if (isPastDay) {
            if (isManualAbsent) {
              absentDays++;
            } else {
              presentDays++;
            }
          }
        }
      }

      // Calculate attendance rate
      // Attendance rate = (present days / past days) * 100
      // Only calculate for past days since we can't determine attendance for future days
      const attendanceRate = pastDays > 0 ? (presentDays / pastDays) * 100 : 0;

      return {
        leaves,
        total,
        presentDays,
        absentDays,
        pendingLeaves,
        approvedLeaves,
        attendanceRate: Math.round(attendanceRate * 100) / 100, // Round to 2 decimal places
        totalWorkingDays,
        pastDays,
        upcomingDays,
        manualAbsentDates: Array.from(manualAbsentDates), // Admin-marked absent dates for staff calendar
        casualLeaves,
        sickLeaves,
        lopLeaves,
      };
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

  async getMonthlyLeaveConfig(year: number, month: number): Promise<MonthlyLeaveConfig> {
    const now = new Date();
    const normalizedYear = year || now.getFullYear();
    const normalizedMonth = month || now.getMonth() + 1;

    // Try to find an existing config
    let config = await MonthlyLeaveConfigModel.findOne({
      year: normalizedYear,
      month: normalizedMonth,
    });

    // If none exists, create a default one (1 casual, 1 sick)
    if (!config) {
      config = await MonthlyLeaveConfigModel.create({
        year: normalizedYear,
        month: normalizedMonth,
        casualLimit: 1,
        sickLimit: 1,
      });
    }

    console.log('[LeaveService.getMonthlyLeaveConfig] Using monthly config', {
      year: config.year,
      month: config.month,
      casualLimit: config.casualLimit,
      sickLimit: config.sickLimit,
    });

    return {
      year: config.year,
      month: config.month,
      casualLimit: config.casualLimit,
      sickLimit: config.sickLimit,
    };
  }

  async getAttendanceDashboardStats(userId: string, year: number, month: number, referenceDate?: Date): Promise<{
    presentDays: number;
    absentDays: number;
    pendingLeaves: number;
    approvedLeaves: number;
    attendanceRate: number;
  }> {
    try {
      // Calculate start and end of month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of month
      const totalDaysInMonth = endDate.getDate();

      // Get user's joining date - do not count days before joining
      const user = await User.findById(userId).select('joiningDate').lean();
      const joiningDate = (user as any)?.joiningDate ? new Date((user as any).joiningDate) : null;
      if (joiningDate) joiningDate.setHours(0, 0, 0, 0);

      const effectiveStart = joiningDate && joiningDate > startDate ? joiningDate : startDate;
      const daysInRange = joiningDate && joiningDate > startDate
        ? Math.ceil((endDate.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
        : totalDaysInMonth;

      const today = referenceDate ? new Date(referenceDate) : new Date();
      today.setHours(0, 0, 0, 0);

      // Get leaves for this user in this month
      const { leaves } = await this.__leaveRepository.getLeavesByDateRange(
        startDate,
        endDate,
        { userId }
      );

      // Get manual absences (admin-marked absent) for this user in this month
      const dateFrom = startDate.toISOString().split('T')[0];
      const dateTo = endDate.toISOString().split('T')[0];
      const manualAbsences = await ManualAbsenceModel.find({
        userId,
        date: { $gte: dateFrom, $lte: dateTo }
      }).lean();
      const manualAbsentDates = new Set<string>(manualAbsences.map((ma: any) => ma.date));

      // Calculate stats
      const approvedLeaves = leaves.filter(l => l.status === LeaveStatus.APPROVED);
      const pendingLeaves = leaves.filter(l => l.status === LeaveStatus.PENDING).length;

      // Build set of absent dates: approved leaves (past) + manual absences (past), respecting joining date
      const absentDateSet = new Set<string>();
      for (const l of approvedLeaves) {
        const leaveDate = new Date(l.leaveDate);
        leaveDate.setHours(0, 0, 0, 0);
        if (joiningDate && leaveDate < joiningDate) continue;
        if (leaveDate < today) {
          absentDateSet.add(leaveDate.toISOString().split('T')[0]);
        }
      }
      for (const dateKey of manualAbsentDates) {
        const d = new Date(dateKey);
        d.setHours(0, 0, 0, 0);
        if (joiningDate && d < joiningDate) continue;
        if (d < today) absentDateSet.add(dateKey);
      }

      const absentDays = absentDateSet.size;

      // Present days - exclude days before joining
      let presentDays = 0;
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1; // 1-indexed

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        // Past month
        presentDays = Math.max(0, daysInRange - absentDays);
      } else if (year === currentYear && month === currentMonth) {
        // Current month - only count days from effective start to today
        const daysPassed = effectiveStart <= today
          ? Math.min(today.getDate(), endDate.getDate()) - effectiveStart.getDate() + 1
          : 0;
        presentDays = Math.max(0, daysPassed - absentDays);
      } else {
        // Future month
        presentDays = 0;
      }

      // Attendance Rate
      const totalRecorded = presentDays + absentDays;
      const attendanceRate = totalRecorded > 0 ? Math.round((presentDays / totalRecorded) * 100) : 0;

      return {
        presentDays,
        absentDays,
        pendingLeaves,
        approvedLeaves: approvedLeaves.length,
        attendanceRate
      };

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

  async getAllStaffAttendance(dateFrom: string, dateTo: string, staffId?: string, today?: string): Promise<AllStaffAttendanceResponseDto> {
    try {
      // Validate dates
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        throw new Error('Invalid date format');
      }

      if (fromDate > toDate) {
        throw new Error('dateFrom cannot be greater than dateTo');
      }

      // Fetch leaves only from leave repository: one staff or all staffs
      const allLeaves = await this.__leaveRepository.getLeavesByFilters({
        dateFrom,
        dateTo,
        ...(staffId && { userId: staffId }),
        limit: 10000,
      });

      // Use client's local today (YYYY-MM-DD) when provided to avoid timezone mismatches
      const todayStr = (typeof today === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(today)) ? today : null;
      const currentDate = new Date();
      const todayForCompare = todayStr ?? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

      // Iterate using date strings to avoid timezone shifts (dateFrom/dateTo are YYYY-MM-DD)
      const addDay = (s: string): string => {
        const d = new Date(s + 'T12:00:00Z');
        d.setUTCDate(d.getUTCDate() + 1);
        return d.toISOString().split('T')[0];
      };
      const dateKeysInRange: string[] = [];
      let cur = dateFrom;
      while (cur <= dateTo) {
        dateKeysInRange.push(cur);
        if (cur === dateTo) break;
        cur = addDay(cur);
      }

      const totalWorkingDays = dateKeysInRange.length;

      const getLeaveUserId = (leave: ILeave): string => {
        const u = leave.userId as any;
        if (u && typeof u === 'object' && u._id) return u._id.toString();
        return leave.userId.toString();
      };

      const getUserInfo = (leave: ILeave): { name: string; email?: string; designation?: string } => {
        const u = leave.userId as any;
        if (u && typeof u === 'object') {
          return {
            name: u.name ?? 'Unknown',
            email: u.email,
            designation: u.designation,
          };
        }
        return { name: 'Unknown' };
      };

      // Fetch manual absences for the date range
      const manualAbsenceQuery: { userId?: any; date: { $gte: string; $lte: string } } = {
        date: { $gte: dateFrom, $lte: dateTo }
      };
      if (staffId) manualAbsenceQuery.userId = staffId;
      const manualAbsences = await ManualAbsenceModel.find(manualAbsenceQuery).lean();
      const manualAbsenceMap = new Map<string, Set<string>>(); // userId -> Set<dateKey>
      manualAbsences.forEach((ma: any) => {
        const uid = ma.userId.toString();
        if (!manualAbsenceMap.has(uid)) manualAbsenceMap.set(uid, new Set());
        manualAbsenceMap.get(uid)!.add(ma.date);
      });

      const leaveMap = new Map<string, Map<string, ILeave>>();
      const userInfoMap = new Map<string, { name: string; email?: string; designation?: string }>();

      // Extract YYYY-MM-DD from a Date using LOCAL calendar day.
      // This keeps admin-marked absences (created from local YYYY-MM-DD strings)
      // and staff leave requests aligned with the same calendar date the UI shows.
      const toDateKey = (d: Date): string => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      allLeaves.leaves.forEach((leave) => {
        const userId = getLeaveUserId(leave);
        const dateKey = toDateKey(new Date(leave.leaveDate));

        if (!leaveMap.has(userId)) {
          leaveMap.set(userId, new Map());
          userInfoMap.set(userId, getUserInfo(leave));
        }
        leaveMap.get(userId)!.set(dateKey, leave);
      });

      // When staffId not provided: fetch ALL active staff for admin view; otherwise use staff from leaves only
      let staffMembers: { id: string; name: string; email?: string; designation?: string; joiningDate?: Date }[];
      if (staffId) {
        const singleStaff = await User.findById(staffId).select('_id name email designation joiningDate').lean();
        staffMembers = singleStaff
          ? [{
              id: (singleStaff._id as any).toString(),
              name: singleStaff.name,
              email: singleStaff.email,
              designation: singleStaff.designation,
              joiningDate: singleStaff.joiningDate ? new Date(singleStaff.joiningDate) : undefined,
            }]
          : [];
      } else {
        const allStaff = await User.find({ role: 'staff', isActive: 1 })
          .select('_id name email designation joiningDate')
          .lean();
        staffMembers = allStaff.map((u) => {
          const fromLeaves = userInfoMap.get((u._id as any).toString());
          return {
            id: (u._id as any).toString(),
            name: (fromLeaves?.name ?? u.name) as string,
            email: (fromLeaves?.email ?? (u as any).email) as string | undefined,
            designation: ((u as any).designation ?? fromLeaves?.designation) as string | undefined,
            joiningDate: (u as any).joiningDate ? new Date((u as any).joiningDate) : undefined,
          };
        });
      }

      const staffAttendance: StaffAttendanceData[] = [];
      let totalPresentDays = 0;
      let totalAbsentDays = 0;
      let totalLeaveDays = 0;
      let totalPendingLeaves = 0;
      let totalCasualLeaves = 0;
      let totalSickLeaves = 0;
      let totalLopLeaves = 0;

      for (const staff of staffMembers) {
        const userId = staff.id;
        const userLeaves = leaveMap.get(userId) || new Map();
        const joiningDateKey = staff.joiningDate ? toDateKey(new Date(staff.joiningDate)) : null;

        const dailyAttendance: DailyAttendanceStatus[] = [];
        let presentDays = 0;
        let absentDays = 0;
        let leaveDays = 0;
        let pendingLeaves = 0;
        let rejectedLeaves = 0;
        let pastDays = 0;
        let upcomingDays = 0;
        let casualLeaves = 0;
        let sickLeaves = 0;
        let lopLeaves = 0;

        for (const dateKey of dateKeysInRange) {
          const isPastDay = dateKey <= todayForCompare;
          const isUpcomingDay = !isPastDay;

          // Dates before joining date: mark as before_joining, do not count in attendance
          const isBeforeJoining = joiningDateKey ? (dateKey < joiningDateKey) : false;

          const leave = userLeaves.get(dateKey);
          let status: 'present' | 'absent' | 'leave' | 'pending' | 'rejected' | 'before_joining' | 'future' = 'present';
          let leaveId: string | undefined;
          let leaveReason: string | undefined;
          let adminComments: string | undefined;

          if (isBeforeJoining) {
            status = 'before_joining';
          } else if (leave) {
            if (isPastDay) pastDays++;
            else upcomingDays++;

            leaveId = leave._id.toString();
            leaveReason = leave.reason;

            switch (leave.status) {
              case LeaveStatus.APPROVED:
                if (isPastDay) {
                  status = 'leave';
                  leaveDays++;
                } else {
                  status = 'leave';
                  leaveDays++;
                }
                {
                  const type = (leave.leaveType as LeaveTypeModel | undefined) ?? LeaveTypeModel.LOP;
                  if (type === LeaveTypeModel.CASUAL) casualLeaves++;
                  else if (type === LeaveTypeModel.SICK) sickLeaves++;
                  else lopLeaves++;
                }
                break;
              case LeaveStatus.PENDING:
                if (isPastDay) {
                  status = 'present';
                  presentDays++;
                } else {
                  status = 'pending';
                  pendingLeaves++;
                }
                break;
              case LeaveStatus.REJECTED:
                if (leave.adminComments) adminComments = leave.adminComments;
                if (isPastDay) {
                  status = 'present';
                  presentDays++;
                } else {
                  status = 'rejected';
                  rejectedLeaves++;
                }
                break;
            }
          } else {
            if (isPastDay) {
              pastDays++;
              presentDays++;
            } else {
              status = 'future';
              upcomingDays++;
            }
          }

          // Apply manual absence (admin marked staff absent)
          const manualAbsentDates = manualAbsenceMap.get(userId);
          const isManualAbsent = manualAbsentDates?.has(dateKey);
          if (isManualAbsent && isPastDay && !isBeforeJoining) {
            if (status === 'present') {
              presentDays--;
              absentDays++;
            }
            status = 'absent';
          }

          dailyAttendance.push({
            date: dateKey,
            status,
            ...(leaveId && { leaveId }),
            ...(leaveReason && { leaveReason }),
            ...(adminComments && { adminComments }),
            ...(isManualAbsent && { isManualAbsence: true }),
            ...(leave && leave.leaveType && { leaveType: leave.leaveType as LeaveTypeModel }),
          });
        }

        // Calculate attendance rate (only for past days)
        const attendanceRate = pastDays > 0 ? (presentDays / pastDays) * 100 : 0;

        // Build leave report: pending requests, approved (upcoming), leave taken
        const pendingRequests: LeaveReportItem[] = [];
        const approvedUpcoming: LeaveReportItem[] = [];
        const leaveTaken: LeaveReportItem[] = [];
        userLeaves.forEach((leave, dateKey) => {
          const item: LeaveReportItem = {
            leaveId: leave._id.toString(),
            leaveDate: dateKey,
            reason: leave.reason,
            status: leave.status
          };
          if (leave.status === LeaveStatus.PENDING) {
            pendingRequests.push(item);
          } else if (leave.status === LeaveStatus.APPROVED) {
            const leaveDateObj = new Date(leave.leaveDate);
            leaveDateObj.setHours(0, 0, 0, 0);
            if (leaveDateObj >= currentDate) {
              approvedUpcoming.push(item);
            } else {
              leaveTaken.push(item);
            }
          }
        });
        const leaveReport: StaffLeaveReport = {
          pendingRequests,
          approvedUpcoming,
          leaveTaken
        };

        staffAttendance.push({
          userId,
          userName: staff.name,
          ...(staff.email && { email: staff.email }),
          ...(staff.designation && { designation: staff.designation }),
          dailyAttendance,
          summary: {
            presentDays,
            absentDays,
            leaveDays,
            pendingLeaves,
            rejectedLeaves,
            attendanceRate: Math.round(attendanceRate * 100) / 100,
            totalWorkingDays,
            pastDays,
            upcomingDays,
            casualLeaves,
            sickLeaves,
            lopLeaves,
          },
          leaveReport
        });

        // Accumulate totals
        totalPresentDays += presentDays;
        totalAbsentDays += absentDays;
        totalLeaveDays += leaveDays;
        totalPendingLeaves += pendingLeaves;
        totalCasualLeaves += casualLeaves;
        totalSickLeaves += sickLeaves;
        totalLopLeaves += lopLeaves;
      }

      // Calculate average attendance rate
      const averageAttendanceRate = staffAttendance.length > 0
        ? staffAttendance.reduce((sum, staff) => sum + staff.summary.attendanceRate, 0) / staffAttendance.length
        : 0;

      const response: AllStaffAttendanceResponse = {
        dateFrom,
        dateTo,
        totalStaff: staffMembers.length,
        staffAttendance,
        overallSummary: {
          totalPresentDays,
          totalAbsentDays,
          totalLeaveDays,
          totalPendingLeaves,
          averageAttendanceRate: Math.round(averageAttendanceRate * 100) / 100,
          totalCasualLeaves,
          totalSickLeaves,
          totalLopLeaves,
        },
      };

      return mapToAllStaffAttendanceResponseDto(response);
    } catch (error) {
      throw error;
    }
  }

  async markStaffAbsent(
    staffId: string,
    date: string,
    adminId: string,
    leaveType?: LeaveType
  ): Promise<{ success: boolean; message: string; autoConvertedToLop?: boolean; originalType?: LeaveType }> {
    try {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return { success: false, message: 'Invalid date format. Use YYYY-MM-DD' };
      }
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return { success: false, message: 'Invalid date' };
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateObj.setHours(0, 0, 0, 0);
      if (dateObj > today) {
        return { success: false, message: 'Cannot mark absent for future dates' };
      }
      const staff = await User.findById(staffId).select('_id role joiningDate').lean();
      if (!staff) {
        return { success: false, message: 'Staff not found' };
      }
      if ((staff as any).role !== 'staff') {
        return { success: false, message: 'User is not a staff member' };
      }
      const joiningDate = (staff as any).joiningDate ? new Date((staff as any).joiningDate) : null;
      if (joiningDate) joiningDate.setHours(0, 0, 0, 0);
      if (joiningDate && dateObj < joiningDate) {
        return { success: false, message: 'Cannot mark absent before staff joining date' };
      }

      // Block if there is already a pending leave request on this date
      const dayStart = new Date(dateObj);
      const dayEnd = new Date(dateObj);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const existingPending = await this.__leaveRepository.getLeavesByDateRange(
        dayStart,
        dayEnd,
        { userId: staffId, status: LeaveStatus.PENDING } as any
      );
      if (existingPending.leaves.length > 0) {
        return {
          success: false,
          message: 'Cannot mark absent. There is a pending leave request for this date.',
        };
      }

      // Determine requested leave type and enforce monthly quotas (similar to approval)
      const requestedType: LeaveTypeModel =
        (leaveType as LeaveTypeModel | undefined) ?? LeaveTypeModel.LOP;
      let finalType: LeaveTypeModel = requestedType;
      let autoConvertedToLop = false;

      console.log('[LeaveService.markStaffAbsent] Marking leave by admin', {
        staffId,
        date: dateObj.toISOString().split('T')[0],
        requestedType,
      });

      if (requestedType === LeaveTypeModel.CASUAL || requestedType === LeaveTypeModel.SICK) {
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const config = await this.getMonthlyLeaveConfig(year, month);
        const limit =
          requestedType === LeaveTypeModel.CASUAL
            ? config.casualLimit
            : config.sickLimit;

        console.log('[LeaveService.markStaffAbsent] Quota config', {
          year,
          month,
          requestedType,
          limit,
        });

        if (limit <= 0) {
          finalType = LeaveTypeModel.LOP;
          autoConvertedToLop = true;
        } else {
          const monthStart = new Date(year, month - 1, 1);
          const monthEnd = new Date(year, month, 0);
          const approvedCount = await this.__leaveRepository.getLeavesByDateRange(
            monthStart,
            monthEnd,
            {
              userId: staffId,
              status: LeaveStatus.APPROVED,
              leaveType: requestedType,
            } as any
          ).then((r) => r.leaves.length);

          console.log('[LeaveService.markStaffAbsent] Existing approved count for type', {
            requestedType,
            approvedCount,
            limit,
          });

          if (approvedCount >= limit) {
            finalType = LeaveTypeModel.LOP;
            autoConvertedToLop = true;
          }
        }
      }

      await LeaveModel.create({
        userId: staffId,
        leaveDate: dateObj,
        reason: 'Marked absent by admin',
        status: LeaveStatus.APPROVED,
        leaveType: finalType,
      } as any);

      console.log('[LeaveService.markStaffAbsent] Created admin leave', {
        staffId,
        date: dateObj.toISOString().split('T')[0],
        finalType,
        autoConvertedToLop,
      });

      return {
        success: true,
        message: 'Leave recorded successfully',
        ...(autoConvertedToLop && {
          autoConvertedToLop: true,
          originalType: requestedType as LeaveType,
        }),
      };
    } catch (error) {
      console.error('markStaffAbsent error:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to mark absent' };
    }
  }

  async removeStaffAbsent(staffId: string, date: string): Promise<{ success: boolean; message: string }> {
    try {
      const result = await ManualAbsenceModel.deleteOne({ userId: staffId, date });
      if (result.deletedCount === 0) {
        return { success: false, message: 'No manual absence found for this date' };
      }
      return { success: true, message: 'Absent mark removed successfully' };
    } catch (error) {
      console.error('removeStaffAbsent error:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to remove absent mark' };
    }
  }
}