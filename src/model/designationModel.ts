import mongoose, { Document, Schema } from 'mongoose';

export interface IDesignation extends Document {
  name: string;
  description?: string;
  status: number; // 1: Active, 0: Inactive
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const designationSchema = new Schema<IDesignation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
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

// Index for better query performance
designationSchema.index({ name: 1 });
designationSchema.index({ status: 1 });
designationSchema.index({ createdAt: -1 });

const Designation = mongoose.model<IDesignation>('Designation', designationSchema);

export default Designation;