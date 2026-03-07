import { Schema, model, Document, Types } from 'mongoose';

export interface IManualAbsence extends Document {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  markedBy: Types.ObjectId; // Admin who marked
  createdAt: Date;
}

const manualAbsenceSchema = new Schema<IManualAbsence>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD']
  },
  markedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Unique constraint: one manual absence per staff per date
manualAbsenceSchema.index({ userId: 1, date: 1 }, { unique: true });

export const ManualAbsenceModel = model<IManualAbsence>('ManualAbsence', manualAbsenceSchema);
