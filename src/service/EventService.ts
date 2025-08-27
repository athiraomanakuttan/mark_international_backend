import { IEventType } from "../model/eventModel";
import { IEventRepository } from "../repository/interface/IEventRepository";
import { StudentData } from "../types/event-type";
import { IEventService } from "./interface/IEventService";

export class EventService implements IEventService {
    private __eventRepository:IEventRepository
    constructor( eventRepository: IEventRepository) {
        this.__eventRepository = eventRepository;
    }

    async createEvent(event: IEventType): Promise<IEventType> {
        return this.__eventRepository.createEvent(event);
    }

    async getEventById(id: string): Promise<IEventType | null> {
        return this.__eventRepository.getEventById(id);
    }

    async updateEvent(id: string, event: Partial<IEventType>): Promise<IEventType | null> {
        return this.__eventRepository.updateEvent(id, event);
    }

    async deleteEvent(id: string): Promise<boolean> {
        return this.__eventRepository.deleteEvent(id);
    }

    async getAllEvents(): Promise<IEventType[]> {
        return this.__eventRepository.getAllEvents();
    }

    async getEventsByDate(date: Date, upcoming: boolean = false,id?:string): Promise<IEventType[]> {
        return this.__eventRepository.getEventsByDate(date, upcoming,id);
    }

    async createStudent(studentData: StudentData): Promise<StudentData> {
        return this.__eventRepository.createStudent(studentData);
    }

    async getRecentEvents(date: Date, upcoming: boolean, id?: string): Promise<IEventType[]> {
        return this.__eventRepository.getRecentEvents(date, upcoming, id);
    }

    async getStudentByEventId(eventId: string, staffId?: string): Promise<any> {
        return this.__eventRepository.getStudentByEventId(eventId, staffId);
    }
}