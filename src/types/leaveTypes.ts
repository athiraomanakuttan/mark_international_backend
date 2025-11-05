import { ILeave, LeaveStatus, ILeaveDocument } from '../model/leaveModel';

// DTO for creating a new leave request
export interface CreateLeaveDto {
  userId: string;
  leaveDate: string; // ISO date string
  reason: string;
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

// User leave balance (if implementing leave balance system)
export interface UserLeaveBalance {
  userId: string;
  totalAllowedLeaves: number;
  leavesUsed: number;
  leavesPending: number;
  remainingLeaves: number;
  year: number;
}

export { ILeave, LeaveStatus, ILeaveDocument };