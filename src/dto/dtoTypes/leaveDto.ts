// Staff attendance / leave report DTOs (for getAllStaffAttendance response)

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
  leaveType?: string;
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
  casualLeaves: number;
  sickLeaves: number;
  lopLeaves: number;
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
    totalCasualLeaves: number;
    totalSickLeaves: number;
    totalLopLeaves: number;
  };
}
