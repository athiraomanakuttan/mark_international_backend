import { Schema, model, Document } from "mongoose";

export interface ITermination extends Document {
  type: 'staff' | 'employee';
  personId: Schema.Types.ObjectId;
  personName: string;
  reason: string;
  terminatedBy: Schema.Types.ObjectId;
  terminatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const terminationSchema = new Schema<ITermination>({
  type: { 
    type: String, 
    enum: ['staff', 'employee'], 
    required: true 
  },
  personId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  personName: { 
    type: String, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  terminatedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  terminatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
});

// Indexes for better query performance
terminationSchema.index({ type: 1 });
terminationSchema.index({ personId: 1 });
terminationSchema.index({ terminatedAt: -1 });

const Termination = model<ITermination>("Termination", terminationSchema);
export default Termination;
