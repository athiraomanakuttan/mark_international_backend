import mongoose from 'mongoose';

export interface ResignationBasicType {
  staffId: mongoose.Types.ObjectId | string;
  reason: string;
  document?: string;
}

export interface ResignationType {
  _id: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  reason: string;
  document?: string;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  approvedBy?: mongoose.Types.ObjectId;
  rejectedBy?: mongoose.Types.ObjectId;
  adminComments?: string;
  staffData?: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    designation: mongoose.Types.ObjectId;
    designationData?: Array<{
      _id: mongoose.Types.ObjectId;
      name: string;
    }>;
  }>;
  approvedByData?: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
  }>;
  rejectedByData?: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateResignationType {
  reason?: string;
  document?: string;
}

export interface ResignationFilterType {
  status?: number[] | number;
  staffId?: string[] | string;
  fromDate?: Date;
  toDate?: Date;
}

export interface ResignationResponseType {
  resignations: ResignationType[];
  totalRecords: number;
}

export interface ApproveRejectResignationType {
  status: number; // 1: Approved, 2: Rejected
  adminComments?: string;
  adminId: mongoose.Types.ObjectId | string;
}

export interface ResignationStatsType {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}