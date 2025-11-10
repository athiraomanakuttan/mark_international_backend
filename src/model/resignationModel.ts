import mongoose, { Document, Schema } from 'mongoose';

export interface IResignation extends Document {
  staffId: mongoose.Types.ObjectId;
  reason: string;
  document?: string; // Cloudinary URL
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  approvedBy?: mongoose.Types.ObjectId;
  rejectedBy?: mongoose.Types.ObjectId;
  adminComments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const resignationSchema = new Schema<IResignation>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    document: {
      type: String,
      default: '',
    },
    status: {
      type: Number,
      default: 0, // 0: Pending, 1: Approved, 2: Rejected
      enum: [0, 1, 2],
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    adminComments: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
resignationSchema.index({ staffId: 1 });
resignationSchema.index({ status: 1 });
resignationSchema.index({ createdAt: -1 });

const Resignation = mongoose.model<IResignation>('Resignation', resignationSchema);

export default Resignation;