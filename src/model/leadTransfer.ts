import mongoose, { Schema, model, Document } from "mongoose";

export interface ILeadTransfer extends Document {
    leadId: mongoose.Types.ObjectId;
    fromStaff: mongoose.Types.ObjectId;
    toStaff: mongoose.Types.ObjectId;
    transferDate: Date;
}


const transferSchema = new Schema<ILeadTransfer & Document>({
    leadId:{type: Schema.Types.ObjectId, ref:"leads"},
    fromStaff:{ type: Schema.Types.ObjectId, ref:"users"},
    toStaff:{ type: Schema.Types.ObjectId, ref:"users"},
    transferDate:{type:Date, default:Date.now()}
})

export const TransferModel = model('transfer_data', transferSchema)

