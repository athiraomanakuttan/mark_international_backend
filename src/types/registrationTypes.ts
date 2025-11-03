import { Types } from 'mongoose';

// Address interface
export interface IAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// Document interface
export interface IDocument {
  title: string;
  url: string;
  uploadedAt?: Date;
}

// Registration interface
export interface IRegistration {
  _id?: Types.ObjectId;
  name: string;
  dateOfBirth: Date;
  contactNumber: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  address: IAddress;
  documents: IDocument[];
  status: number; // 1: pending, 2: approved, 3: rejected
  createdAt?: Date;
  updatedAt?: Date;
}

// Registration form errors interface (matching frontend)
export interface RegistrationFormErrors {
  name?: string;
  dateOfBirth?: string;
  contactNumber?: string;
  maritalStatus?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  documents?: { [key: string]: string | undefined };
}

// Registration response interface
export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: IRegistration;
  errors?: RegistrationFormErrors;
}

// Create registration DTO
export interface CreateRegistrationDto {
  name: string;
  dateOfBirth: string; // Will be converted to Date
  contactNumber: string;
  maritalStatus: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}