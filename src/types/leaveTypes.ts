import { ILeave, LeaveStatus, ILeaveDocument, LeaveType } from '../model/leaveModel';

// DTO for creating a new leave request
export interface CreateLeaveDto {
  userId: string;
  leaveDate: string; // ISO date string
  reason: string;
  leaveType?: LeaveType;
}

// DTO for updating leave status (admin only)
export interface UpdateLeaveStatusDto {
  status: LeaveStatus;
  adminComments?: string;
}

// Leave response interface
export interface LeaveResponse {
  success: boolean;
  message: string;
  data?: ILeave | ILeave[];
  errors?: LeaveFormErrors;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  // Optional flags for quota handling when approving / marking leave
  autoConvertedToLop?: boolean;
  originalType?: LeaveType;
}

// Form validation errors
export interface LeaveFormErrors {
  userId?: string;
  leaveDate?: string;
  reason?: string;
  documents?: string;
  general?: string;
}

// Query filters for getting leaves
export interface LeaveQueryFilters {
  userId?: string;
  status?: LeaveStatus;
  // Optional filter by leave type (casual / sick / lop)
  leaveType?: LeaveType;
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  page?: number;
  limit?: number;
  sortBy?: 'leaveDate' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// Leave statistics interface
export interface LeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  upcomingLeaves: number;
}

// Extended leave interface with user details
export interface ILeaveWithUser extends Omit<ILeave, 'userId'> {
  userId: {
    _id: string;
    name: string;
    email: string;
    employeeId?: string;
    joiningDate: Date;
  };
}

// Leave request validation result
export interface LeaveValidationResult {
  isValid: boolean;
  errors: LeaveFormErrors;
}

// Monthly leave summary
export interface MonthlyLeaveSummary {
  month: string;
  year: number;
  totalLeaves: number;
  approvedLeaves: number;
  pendingLeaves: number;
  rejectedLeaves: number;
}

// Global monthly leave configuration (same for all staff)
export interface MonthlyLeaveConfig {
  year: number;
  month: number;
  casualLimit: number;
  sickLimit: number;
}

// User leave balance (if implementing leave balance system)
export interface UserLeaveBalance {
  userId: string;
  totalAllowedLeaves: number;
  leavesUsed: number;
  leavesPending: number;
  remainingLeaves: number;
  year: number;
}

// Enhanced date range statistics with attendance metrics
export interface DateRangeAttendanceStats {
  leaves: ILeave[];
  total: number;
  presentDays: number; // No leave request or pending request for past days
  absentDays: number; // Approved leave requests for past days
  pendingLeaves: number; // Pending leave requests for upcoming days
  approvedLeaves: number; // Approved leave requests for upcoming days
  attendanceRate: number; // Percentage of attendance
  totalWorkingDays: number; // Total days in the range
  pastDays: number; // Days that have already passed
  upcomingDays: number; // Days that are yet to come
  manualAbsentDates?: string[]; // Admin-marked absent dates (YYYY-MM-DD) for staff calendar
  // Per-type approved leave counts in the range
  casualLeaves: number;
  sickLeaves: number;
  lopLeaves: number;
}

// Daily attendance status for a staff member
export interface DailyAttendanceStatus {
  date: string; // ISO date string (YYYY-MM-DD)
  status: 'present' | 'absent' | 'leave' | 'pending' | 'rejected' | 'before_joining' | 'future';
  leaveId?: string;
  leaveReason?: string;
  adminComments?: string; // Rejection reason when status is rejected
  isManualAbsence?: boolean; // True when admin marked absent (no leave request)
  leaveType?: LeaveType; // Category when status is 'leave'
}

// Staff attendance summary
export interface StaffAttendanceSummary {
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  pendingLeaves: number;
  rejectedLeaves: number;
  attendanceRate: number;
  totalWorkingDays: number;
  pastDays: number;
  upcomingDays: number;
  // Per-type approved leave counts in range
  casualLeaves: number;
  sickLeaves: number;
  lopLeaves: number;
}

// Leave report item (minimal leave info for report listing)
export interface LeaveReportItem {
  leaveId: string;
  leaveDate: string; // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
}

// Per-staff leave report: pending, approved (upcoming), leave taken
export interface StaffLeaveReport {
  pendingRequests: LeaveReportItem[];
  approvedUpcoming: LeaveReportItem[]; // approved but date is upcoming
  leaveTaken: LeaveReportItem[]; // approved and date has passed
}

// Staff attendance data
export interface StaffAttendanceData {
  userId: string;
  userName: string;
  email?: string;
  designation?: string;
  employeeId?: string;
  dailyAttendance: DailyAttendanceStatus[];
  summary: StaffAttendanceSummary;
  leaveReport: StaffLeaveReport;
}

// All staff attendance response
export interface AllStaffAttendanceResponse {
  dateFrom: string;
  dateTo: string;
  totalStaff: number;
  staffAttendance: StaffAttendanceData[];
  overallSummary: {
    totalPresentDays: number;
    totalAbsentDays: number;
    totalLeaveDays: number;
    totalPendingLeaves: number;
    averageAttendanceRate: number;
    totalCasualLeaves: number;
    totalSickLeaves: number;
    totalLopLeaves: number;
  };
}

export { ILeave, LeaveStatus, ILeaveDocument, LeaveType };