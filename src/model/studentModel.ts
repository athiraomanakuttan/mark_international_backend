import {Schema,model} from 'mongoose'
import { StudentData } from '../types/event-type';
const studentSchema = new Schema<StudentData>({
   name: { type: String, required: true },
   phoneNumber: { type: String, required: true },
   address: { type: String, required: false},
   eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
   email: { type: String, required: false },
   preferredCountry: { type: [String], required: false },
   staffId: { type: Schema.Types.ObjectId, ref: 'User' }
},{timestamps:true});

const StudentModel = model<StudentData>('Student', studentSchema);

export { StudentModel };