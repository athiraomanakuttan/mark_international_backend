import { Schema, model, Document, Types } from 'mongoose';

// Document interface for leave attachments
export interface ILeaveDocument {
  title: string;
  url: string;
}

// Leave status enum
export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Main leave interface
export interface ILeave extends Document {
  userId: Types.ObjectId;
  leaveDate: Date;
  reason: string;
  documents?: ILeaveDocument[];
  status: LeaveStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Document schema for leave attachments
const leaveDocumentSchema = new Schema<ILeaveDocument>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Main leave schema
const leaveSchema = new Schema<ILeave>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  leaveDate: {
    type: Date,
    required: true,
    index: true,
    validate: {
      validator: function(value: Date) {
        // Leave date should be today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value >= today;
      },
      message: 'Leave date cannot be in the past'
    }
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters long'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  documents: [leaveDocumentSchema],
  status: {
    type: String,
    enum: Object.values(LeaveStatus),
    default: LeaveStatus.PENDING,
    index: true
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient queries
leaveSchema.index({ userId: 1, leaveDate: 1 });
leaveSchema.index({ userId: 1, status: 1 });
leaveSchema.index({ leaveDate: 1, status: 1 });

// Pre-save middleware to validate leave date against user's joining date
leaveSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('leaveDate')) {
    // Populate user to get joining date
    await this.populate('userId', 'joiningDate');
    
    const user = this.userId as any;
    if (user && user.joiningDate) {
      const joiningDate = new Date(user.joiningDate);
      joiningDate.setHours(0, 0, 0, 0);
      
      const leaveDate = new Date(this.leaveDate);
      leaveDate.setHours(0, 0, 0, 0);
      
      if (leaveDate < joiningDate) {
        const error = new Error('Leave date cannot be before joining date');
        return next(error);
      }
    }
  }
  next();
});

// Virtual for formatted leave date
leaveSchema.virtual('formattedLeaveDate').get(function() {
  return this.leaveDate.toISOString().split('T')[0];
});

// Virtual for days until leave
leaveSchema.virtual('daysUntilLeave').get(function() {
  const today = new Date();
  const leaveDate = new Date(this.leaveDate);
  const diffTime = leaveDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

export const LeaveModel = model<ILeave>('Leave', leaveSchema);