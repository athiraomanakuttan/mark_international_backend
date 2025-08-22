import { model, Schema } from "mongoose";
import { FollowUpType } from "../types/followupType";

const followupSchema = new Schema<FollowUpType>({
    assignedAgentId: { type: String, required: true },
    leadId: { type: String, required: true },
    followup_date: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    remarks: { type: String, required: false }
});

const Followup = model('followup', followupSchema);

export default Followup;