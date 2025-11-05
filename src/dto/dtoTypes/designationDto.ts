import mongoose from 'mongoose';

export interface DesignationDto {
  id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  createdById: mongoose.Types.ObjectId | string;
  createdByName: string;
}