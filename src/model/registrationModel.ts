import { Schema, model, Document } from 'mongoose';
import { IRegistration } from '../types/registrationTypes';

// Document interface
interface IDocumentUpload {
  title: string;
  url: string;
  uploadedAt?: Date;
}

// Address schema
const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true }
});

// Document schema
const documentSchema = new Schema<IDocumentUpload>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

// Registration schema
const registrationSchema = new Schema<IRegistration & Document>({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  contactNumber: { type: String, required: true },
  maritalStatus: { 
    type: String, 
    required: true,
    enum: ['single', 'married', 'divorced', 'widowed']
  },
  address: { type: addressSchema, required: true },
  documents: [documentSchema],
  status: { 
    type: Number, 
    enum: [1, 2, 3], 
    default: 1 
  }, // 1: pending, 2: approved, 3: rejected
}, { timestamps: true });

const RegistrationModel = model<IRegistration & Document>('Registration', registrationSchema);

export default RegistrationModel;