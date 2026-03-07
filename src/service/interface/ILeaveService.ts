import {
  CreateLeaveDto,
  LeaveResponse,
  LeaveQueryFilters,
  UpdateLeaveStatusDto,
  LeaveStats,
  MonthlyLeaveSummary,
  DateRangeAttendanceStats,
  MonthlyLeaveConfig,
} from '../../types/leaveTypes';
import { LeaveStatus, LeaveType } from '../../model/leaveModel';
import { AllStaffAttendanceResponseDto } from '../../dto/dtoTypes/leaveDto';

export interface ILeaveService {
  createLeave(leaveData: CreateLeaveDto, files?: Express.Multer.File[]): Promise<LeaveResponse>;
  getLeaveById(leaveId: string): Promise<any>;
  updateLeaveStatus(leaveId: string, statusData: UpdateLeaveStatusDto): Promise<LeaveResponse>;
  deleteLeave(leaveId: string): Promise<boolean>;
  getLeavesByFilters(filters: LeaveQueryFilters): Promise<LeaveResponse>;
  getLeavesByUserId(userId: string, filters?: Partial<LeaveQueryFilters>): Promise<LeaveResponse>;
  getLeavesByStatus(status: LeaveStatus, filters?: Partial<LeaveQueryFilters>): Promise<LeaveResponse>;
  getLeavesByDateRange(dateFrom: string, dateTo: string, filters?: Partial<LeaveQueryFilters>): Promise<DateRangeAttendanceStats>;
  getLeaveStats(): Promise<LeaveStats>;
  getMonthlyLeaveSummary(year: number): Promise<MonthlyLeaveSummary[]>;
  getAttendanceDashboardStats(userId: string, year: number, month: number, referenceDate?: Date): Promise<{
    presentDays: number;
    absentDays: number;
    pendingLeaves: number;
    approvedLeaves: number;
    attendanceRate: number;
  }>;
  getAllStaffAttendance(dateFrom: string, dateTo: string, staffId?: string, today?: string): Promise<AllStaffAttendanceResponseDto>;
  markStaffAbsent(
    staffId: string,
    date: string,
    adminId: string,
    leaveType?: LeaveType
  ): Promise<{ success: boolean; message: string; autoConvertedToLop?: boolean; originalType?: LeaveType }>;
  removeStaffAbsent(staffId: string, date: string): Promise<{ success: boolean; message: string }>;
  getMonthlyLeaveConfig(year: number, month: number): Promise<MonthlyLeaveConfig>;
}
