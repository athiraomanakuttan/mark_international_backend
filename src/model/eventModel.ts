import mongoose, {Schema, model} from 'mongoose'

export interface IEventType{
    name: string;
    startDate: Date;
    endDate: Date;
    location ?: string
    staffIds ?: mongoose.Types.ObjectId[],
    isFinished ?: boolean
}

const EventSchema = new Schema<IEventType>({
    name: {type: String, required: true},
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    location: {type: String},
    staffIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isFinished: {type: Boolean, default: false}
}, {
    timestamps: true
})

// Index for querying active events
EventSchema.index({ endDate: 1 });
EventSchema.index({ isFinished: 1 });

export const EventModel = model<IEventType>('Event', EventSchema)