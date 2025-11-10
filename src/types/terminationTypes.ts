import { Schema } from "mongoose";
import { BasicResponse } from "./basicResponse";

export type TerminationType = 'staff' | 'employee';

export interface TerminationBasicType {
  type: TerminationType;
  personId: string | Schema.Types.ObjectId;
  personName: string;
  reason: string;
  terminatedBy: string | Schema.Types.ObjectId;
  terminatedAt?: Date;
}

export interface TerminationFullType extends TerminationBasicType {
  _id: string | Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  personData?: Array<{
    _id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    designation?: string;
  }>;
  terminatedByData?: Array<{
    _id: string;
    name: string;
  }>;
}

export interface CreateTerminationRequest {
  type: TerminationType;
  personId: string;
  reason: string;
}

export interface TerminationListResponse {
  terminations: TerminationFullType[];
  totalRecords: number;
}

export interface TerminationFilterType {
  type?: TerminationType;
  search?: string;
}

export interface StaffEmployeeListItem {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  designation?: string;
  isActive: number;
}

export type TerminationResponse = BasicResponse<TerminationFullType>;
export type TerminationListResponseType = BasicResponse<TerminationListResponse>;
export type StaffEmployeeListResponse = BasicResponse<StaffEmployeeListItem[]>;
