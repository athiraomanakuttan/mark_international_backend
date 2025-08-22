// create model for lead
import { LeadBasicType } from '../types/leadTypes';
import {Schema, model, Document} from 'mongoose';

const leadSourceSchema = new Schema<LeadBasicType & Document>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  leadType: { type: Number, default: 1 }, //[{name:"Study Abroad", value:1}]
  assignedAgent: {type: Schema.Types.ObjectId, ref: 'User'},
  cost: { type: Number },
  priority: { type: Number, enum: [1, 2,3,4], default: 2 }, //[{name:"High", value:1}, {name:"Normal", value:2}, {name:"Low", value:3}, {name:"Negative", value:4}]
  address: { type: String },
  remarks: { type: String },
  called_date: {type: Date, required: false},
  call_result: { type: Number, enum: [2,3,4], required: false }, //  {name: "Confirmed", value: 2},{name: "Follow up", value: 3}, {name: "Rejected", value: 4},
  leadSource: { type: Number, enum:[1,2], default: 1 }, //[{name:"Direct Entry", value:1}, {name:"Lead from CSV", value:2}]
  category: { type: String, default:1, enum:[1]},
  createdBy:{type: Schema.Types.ObjectId, ref: 'User'},
  status: { type: Number, enum: [ -1,0,1, 2, 3,4,5], default: 1 }, // -1: perement delete, 0:delete, [{name:"New", value:1}, {name:"Confirmed", value:2},  {name:"Follow Up", value:3},{name:"Rejected", value:4}, {name:"Lost", value:5}, {name:"Converted", value:6}]
  referredBy: { type: String },
},{timestamps: true});

const LeadModel = model<LeadBasicType & Document>('Lead', leadSourceSchema);

export default LeadModel;
