import {
  AllStaffAttendanceResponse,
  StaffAttendanceData,
  LeaveReportItem,
  StaffLeaveReport,
  DailyAttendanceStatus,
  StaffAttendanceSummary,
} from '../../types/leaveTypes';
import {
  AllStaffAttendanceResponseDto,
  StaffAttendanceDataDto,
  LeaveReportItemDto,
  StaffLeaveReportDto,
  DailyAttendanceStatusDto,
  StaffAttendanceSummaryDto,
} from '../dtoTypes/leaveDto';

const mapLeaveReportItemToDto = (item: LeaveReportItem): LeaveReportItemDto => ({
  leaveId: item.leaveId,
  leaveDate: item.leaveDate,
  reason: item.reason,
  status: item.status,
});

const mapStaffLeaveReportToDto = (report: StaffLeaveReport): StaffLeaveReportDto => ({
  pendingRequests: report.pendingRequests.map(mapLeaveReportItemToDto),
  approvedUpcoming: report.approvedUpcoming.map(mapLeaveReportItemToDto),
  leaveTaken: report.leaveTaken.map(mapLeaveReportItemToDto),
});

const mapDailyAttendanceToDto = (d: DailyAttendanceStatus): DailyAttendanceStatusDto => ({
  date: d.date,
  status: d.status,
  ...(d.leaveId && { leaveId: d.leaveId }),
  ...(d.leaveReason && { leaveReason: d.leaveReason }),
  ...(d.adminComments && { adminComments: d.adminComments }),
  ...(d.isManualAbsence && { isManualAbsence: d.isManualAbsence }),
  ...(d.leaveType && { leaveType: d.leaveType }),
});

const mapSummaryToDto = (s: StaffAttendanceSummary): StaffAttendanceSummaryDto => ({
  presentDays: s.presentDays,
  absentDays: s.absentDays,
  leaveDays: s.leaveDays,
  pendingLeaves: s.pendingLeaves,
  rejectedLeaves: s.rejectedLeaves,
  attendanceRate: s.attendanceRate,
  totalWorkingDays: s.totalWorkingDays,
  pastDays: s.pastDays,
  upcomingDays: s.upcomingDays,
  casualLeaves: s.casualLeaves,
  sickLeaves: s.sickLeaves,
  lopLeaves: s.lopLeaves,
});

const mapStaffAttendanceDataToDto = (data: StaffAttendanceData): StaffAttendanceDataDto => ({
  userId: data.userId,
  userName: data.userName,
  ...(data.email && { email: data.email }),
  ...(data.designation && { designation: data.designation }),
  dailyAttendance: data.dailyAttendance.map(mapDailyAttendanceToDto),
  summary: mapSummaryToDto(data.summary),
  leaveReport: mapStaffLeaveReportToDto(data.leaveReport),
});

export const mapToAllStaffAttendanceResponseDto = (
  response: AllStaffAttendanceResponse
): AllStaffAttendanceResponseDto => ({
  dateFrom: response.dateFrom,
  dateTo: response.dateTo,
  totalStaff: response.totalStaff,
  staffAttendance: response.staffAttendance.map(mapStaffAttendanceDataToDto),
  overallSummary: {
    totalPresentDays: response.overallSummary.totalPresentDays,
    totalAbsentDays: response.overallSummary.totalAbsentDays,
    totalLeaveDays: response.overallSummary.totalLeaveDays,
    totalPendingLeaves: response.overallSummary.totalPendingLeaves,
    averageAttendanceRate: response.overallSummary.averageAttendanceRate,
    totalCasualLeaves: response.overallSummary.totalCasualLeaves,
    totalSickLeaves: response.overallSummary.totalSickLeaves,
    totalLopLeaves: response.overallSummary.totalLopLeaves,
  },
});
