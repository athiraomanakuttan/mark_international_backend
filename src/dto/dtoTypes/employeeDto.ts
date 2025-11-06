import mongoose from 'mongoose';

export interface EmployeeDto {
  id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  designationId: mongoose.Types.ObjectId | string;
  dateOfJoining: string;
  profilePicture?: string;
  address?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  createdById: mongoose.Types.ObjectId | string;
  createdByName: string;
}