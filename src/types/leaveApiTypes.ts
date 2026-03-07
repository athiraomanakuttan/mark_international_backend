/**
 * API: Get All Staff Attendance / Leave Report
 * Route, input (query), and output types in TypeScript.
 */

// ========== ROUTE ==========
// Method: GET
// Path:   /api/leaves/staff-attendance

// ========== INPUT (Query parameters) ==========
export interface GetAllStaffAttendanceQuery {
  /** Start of date range (required). Format: YYYY-MM-DD */
  dateFrom: string;
  /** End of date range (required). Format: YYYY-MM-DD */
  dateTo: string;
  /** Optional. If provided, returns leave/attendance for this staff (user id) only */
  staffId?: string;
}

// ========== OUTPUT (Response body: success case) ==========
// HTTP 200 — success: true, message: string, data: AllStaffAttendanceResponseDto

export interface LeaveReportItemDto {
  leaveId: string;
  leaveDate: string;
  reason: string;
  status: string;
}

export interface StaffLeaveReportDto {
  pendingRequests: LeaveReportItemDto[];
  approvedUpcoming: LeaveReportItemDto[];
  leaveTaken: LeaveReportItemDto[];
}

export interface DailyAttendanceStatusDto {
  date: string;
  status: 'present' | 'absent' | 'leave' | 'pending' | 'rejected' | 'before_joining' | 'future';
  leaveId?: string;
  leaveReason?: string;
  adminComments?: string;
  isManualAbsence?: boolean;
}

export interface StaffAttendanceSummaryDto {
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  pendingLeaves: number;
  rejectedLeaves: number;
  attendanceRate: number;
  totalWorkingDays: number;
  pastDays: number;
  upcomingDays: number;
}

export interface StaffAttendanceDataDto {
  userId: string;
  userName: string;
  email?: string;
  designation?: string;
  dailyAttendance: DailyAttendanceStatusDto[];
  summary: StaffAttendanceSummaryDto;
  leaveReport: StaffLeaveReportDto;
}

export interface AllStaffAttendanceResponseDto {
  dateFrom: string;
  dateTo: string;
  totalStaff: number;
  staffAttendance: StaffAttendanceDataDto[];
  overallSummary: {
    totalPresentDays: number;
    totalAbsentDays: number;
    totalLeaveDays: number;
    totalPendingLeaves: number;
    averageAttendanceRate: number;
  };
}

/** Full API response envelope (what the client receives) */
export interface GetAllStaffAttendanceApiResponse {
  success: true;
  message: string;
  data: AllStaffAttendanceResponseDto;
}
