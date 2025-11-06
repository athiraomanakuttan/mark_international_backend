import mongoose from 'mongoose';

export interface EmployeeBasicType {
  name: string;
  email: string;
  phoneNumber: string;
  designation: mongoose.Types.ObjectId | string;
  dateOfJoining: Date;
  profilePicture?: string;
  address?: string;
  status?: number;
  createdBy?: mongoose.Types.ObjectId;
}

export interface EmployeeType {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  designation: mongoose.Types.ObjectId;
  dateOfJoining: Date;
  profilePicture?: string;
  address?: string;
  status: number;
  createdBy: mongoose.Types.ObjectId;
  designationData?: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
  }>;
  createdByData?: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateEmployeeType {
  name?: string;
  email?: string;
  phoneNumber?: string;
  designation?: mongoose.Types.ObjectId | string;
  dateOfJoining?: Date;
  profilePicture?: string;
  address?: string;
  status?: number;
}

export interface EmployeeFilterType {
  status?: number[] | number;
  designation?: string[] | string;
  fromDate?: Date;
  toDate?: Date;
  createdBy?: string[] | string;
}

export interface EmployeeResponseType {
  employees: EmployeeType[];
  totalRecords: number;
}