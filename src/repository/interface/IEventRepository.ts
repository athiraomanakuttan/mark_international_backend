import { IEventType } from "../../model/eventModel";
import { StudentData } from "../../types/event-type";

export interface IEventRepository {
    createEvent(event: IEventType): Promise<IEventType>;
    getEventById(id: string): Promise<IEventType | null>;
    updateEvent(id: string, event: Partial<IEventType>): Promise<IEventType | null>;
    deleteEvent(id: string): Promise<boolean>;
    getAllEvents(): Promise<IEventType[]>;
    getEventsByDate(date: Date, upcoming: boolean,id?:string): Promise<IEventType[]>;
    createStudent(studentData: StudentData): Promise<StudentData>;
    getRecentEvents(date: Date, upcoming: boolean, id?: string): Promise<IEventType[]>;
    getStudentByEventId(eventId: string, staffId?: string): Promise<any>;
    getUpcomingEvents(id?: string): Promise<IEventType[]>;
    getOngoingEvents(id?: string): Promise<IEventType[]>;
    getPastEvents(id?: string): Promise<IEventType[]>;
}
