import mongoose from 'mongoose';

export interface DesignationBasicType {
  name: string;
  description?: string;
  status?: number;
  createdBy?: mongoose.Types.ObjectId;
}

export interface DesignationType {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  status: number;
  createdBy: mongoose.Types.ObjectId;
  createdByData?: Array<{
    _id: mongoose.Types.ObjectId;
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateDesignationType {
  name?: string;
  description?: string;
  status?: number;
}

export interface DesignationFilterType {
  status?: number[];
  fromDate?: Date;
  toDate?: Date;
  createdBy?: string[];
}

export interface DesignationResponseType {
  designations: DesignationType[];
  totalRecords: number;
}