import mongoose, { Document, Schema } from 'mongoose';

export interface IEmployee extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  designation: mongoose.Types.ObjectId;
  dateOfJoining: Date;
  profilePicture?: string;
  address?: string;
  status: number; // 1: Active, 0: Inactive
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: Schema.Types.ObjectId,
      ref: 'Designation',
      required: true,
    },
    dateOfJoining: {
      type: Date,
      required: true,
      default: Date.now,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: Number,
      default: 1, // 1: Active, 0: Inactive
      enum: [0, 1],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
employeeSchema.index({ email: 1 });
employeeSchema.index({ name: 1 });
employeeSchema.index({ designation: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ createdAt: -1 });

const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);

// Drop the employeeId index if it exists (migration cleanup)
Employee.collection.dropIndex('employeeId_1').catch(() => {
  // Index doesn't exist, ignore the error
});

export default Employee;