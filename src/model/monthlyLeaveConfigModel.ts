import { Schema, model, Document } from 'mongoose';

export interface IMonthlyLeaveConfig extends Document {
  year: number;
  month: number; // 1-12
  casualLimit: number;
  sickLimit: number;
}

const monthlyLeaveConfigSchema = new Schema<IMonthlyLeaveConfig>(
  {
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    casualLimit: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    sickLimit: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

monthlyLeaveConfigSchema.index({ year: 1, month: 1 }, { unique: true });

export const MonthlyLeaveConfigModel = model<IMonthlyLeaveConfig>(
  'MonthlyLeaveConfig',
  monthlyLeaveConfigSchema
);

