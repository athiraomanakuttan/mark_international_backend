import { ILeave, LeaveStatus } from "../../model/leaveModel";
import { LeaveQueryFilters, LeaveStats, MonthlyLeaveSummary } from "../../types/leaveTypes";

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