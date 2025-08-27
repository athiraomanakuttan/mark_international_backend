import mongoose, {Schema, model} from 'mongoose'

export interface IEventType{
    name: string;
    date: Date;
    location ?: string
    staffIds ?: mongoose.Types.ObjectId[],
    isFinished ?: boolean
}

const EventSchema = new Schema<IEventType>({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    location: {type: String},
    staffIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isFinished: {type: Boolean, default: false}
})

export const EventModel = model<IEventType>('Event', EventSchema)