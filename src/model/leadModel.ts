// create model for lead
import { LeadBasicType } from '../types/leadTypes';
import {Schema, model, Document} from 'mongoose';

const leadSourceSchema = new Schema<LeadBasicType & Document>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  leadType: { type: Number, default: 1 }, //[{name:"Study Abroad", value:1}]
  assignedAgent: { type: String, },
  cost: { type: Number },
  priority: { type: Number, enum: [1, 2,3,4], default: 2 }, //[{name:"High", value:1}, {name:"Normal", value:2}, {name:"Low", value:3}, {name:"Negative", value:4}]
  address: { type: String },
  remarks: { type: String },
  leadSource: { type: Number, enum:[1,2], default: 1 }, //[{name:"Direct Entry", value:1}, {name:"Lead from CSV", value:2}]
  category: { type: String },
  status: { type: Number, enum: [ -1,0,1, 2, 3,4,5], default: 1 }, // -1: perement delete, 0:delete, [{name:"New", value:1}, {name:"Confirmed", value:2},  {name:"Follow Up", value:3},{name:"Rejected", value:4}, {name:"Lost", value:5}, {name:"Converted", value:6}]
  referredBy: { type: String, },
  createdAt: { type: String },
  updatedAt: { type: String },
  createdBy: { type: String }
});

const LeadModel = model<LeadBasicType & Document>('Lead', leadSourceSchema);

export default LeadModel;
