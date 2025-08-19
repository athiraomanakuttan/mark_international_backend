
import mongoose, { Schema , Document, model} from 'mongoose';
export interface  ILeadHistory{
    leadId: mongoose.Types.ObjectId,
    remark?: String,
    historyType: number, //1: created, 2: updated, 3: deleted,4: transferred,
    transferId?: mongoose.Types.ObjectId,
    deletedBy?: mongoose.Types.ObjectId,
    updatedBy?: mongoose.Types.ObjectId,
    from?: mongoose.Types.ObjectId,
    to?: mongoose.Types.ObjectId
}
const LeadHistorySchema = new Schema<ILeadHistory & Document>({
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
  remark: { type: String, required: false },
  historyType: { type: Number, enum: [1,2,3,4], required: true }, //1: created, 2: updated, 3: deleted,4: transferred
  transferId:{ type: Schema.Types.ObjectId, ref: 'Transfer', required: false },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  from: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  to: { type: Schema.Types.ObjectId, ref: 'User', required: false }
},{timestamps: true});

const LeadHistory = model<ILeadHistory>('LeadHistory', LeadHistorySchema);

export default LeadHistory;