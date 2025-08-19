
import { Schema , Document, model} from 'mongoose';
export interface  ILeadHistory{
    leadId: Schema.Types.ObjectId,
    remark?: String,
    historyType: number, //1: created, 2: updated, 3: deleted,4: transferred,
    transferId?: Schema.Types.ObjectId,
    deletedBy?: Schema.Types.ObjectId,
    updatedBy?: Schema.Types.ObjectId
}
const LeadHistorySchema = new Schema<ILeadHistory & Document>({
  leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
  remark: { type: String, required: true },
  historyType: { type: Number, enum: [1,2,3,4], required: true }, //1: created, 2: updated, 3: deleted,4: transferred
  transferId:{ type: Schema.Types.ObjectId, ref: 'Transfer', required: false },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: false },
},{timestamps: true});

const LeadHistory = model<ILeadHistory>('LeadHistory', LeadHistorySchema);

export default LeadHistory;