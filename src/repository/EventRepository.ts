import { EventModel, IEventType } from "../model/eventModel";
import { StudentModel } from "../model/studentModel";
import { StudentData } from "../types/event-type";
import { IEventRepository } from "./interface/IEventRepository";

export class EventRepository implements IEventRepository{
    async createEvent(event: IEventType): Promise<IEventType> {
        try {
            const newEvent = new EventModel(event);
        return await newEvent.save();
        } catch (error) {
            throw new Error("Error creating event");
        }
    }

    async getEventById(id: string): Promise<IEventType | null> {
        try {
            return await EventModel.findById(id).exec();
        } catch (error) {
            throw new Error("Error fetching event");
        }
    }

    async updateEvent(id: string, event: Partial<IEventType>): Promise<IEventType | null> {
        try {
            const updatedEvent = await EventModel.findByIdAndUpdate(id, event, { new: true }).exec();
            console.log(updatedEvent)
            return updatedEvent;
        } catch (error) {
            console.log(error);
            throw new Error("Error updating event");
        }
    }

    async deleteEvent(id: string): Promise<boolean>{
        try {
            const result = await EventModel.findByIdAndDelete(id).exec();
            return result !== null;
        } catch (error) {
            throw new Error("Error deleting event");
        }
    }

    async getAllEvents(): Promise<IEventType[]> {
        try {
            return await EventModel.find().exec();
        } catch (error) {
            throw new Error("Error fetching events");
        }
    }

    async getEventsByDate(date: Date, upcoming: boolean, id?: string): Promise<IEventType[]> {
        try {
            const query: any = {}
             query["date"] = upcoming ? { $gte: date }  :  { $lte: date };
            if(id){
               query.staffIds = { $in: [id] };
            }
            return await EventModel.find(query).sort({date:1}).exec();
        } catch (error) {
            throw new Error("Error fetching events");
        }
    }

        async createStudent(studentData: StudentData): Promise<StudentData> {
    try {
        const newStudent = new StudentModel(studentData);
        return await newStudent.save();
    } catch (error) {
        throw new Error("Error creating student");
    }
}

async getRecentEvents(date: Date, upcoming: boolean, id?: string): Promise<IEventType[]> {
    try {
        const query: any = {};
        query["date"] = upcoming ? { $gte: date } : { $lte: date };
        
        if (id) {
            query.staffIds = { $in: [id] };
        }

        const response =  await EventModel.find(query)
            .sort({ date: -1 })
            .populate("staffIds", "name _id") // 👈 fetch only name & id from Staff
            .exec();
        console.log(response[0])
        return response;
    } catch (error) {
        console.log(error)
        throw new Error("Error fetching events");
    }
}

async getStudentByEventId(eventId: string, staffId?: string): Promise<any> {
    try {
        const query: any = { eventId };
        if (staffId) {
            query.staffId = staffId;
        }
        

        return await StudentModel.find(query)
            .sort({ date: -1 })
            .populate("staffId", "name _id") // 👈 fetch only name & id from Staff
            .exec();

    } catch (error) {
        throw new Error("Error fetching student");
    }
}
}
