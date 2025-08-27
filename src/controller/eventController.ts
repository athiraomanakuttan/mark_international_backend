import { STATUS_CODE } from "../constance/statusCode";
import { MESSAGE_CONST } from "../constant/MessageConst";
import { IEventType } from "../model/eventModel";
import { IEventService } from "../service/interface/IEventService";
import {Request, Response} from 'express'
import { CustomRequestType } from "../types/requestType";
import { StudentData } from "../types/event-type";

export class EventController{
    private __eventService: IEventService;

    constructor(eventService: IEventService) {
        this.__eventService = eventService;
    }

    async createEvent(req:Request,res:Response): Promise<void> {
        try{
            const event: IEventType = req.body;
            await this.__eventService.createEvent(event);
            res.status(STATUS_CODE.CREATED).json({status: true, message: MESSAGE_CONST.CREATED});
        }catch(err){
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async getUpcomingEvents(req:CustomRequestType, res:Response):Promise<void>{
        try{
            const id = String(req.user?.id)
            const role = String(req.user?.role)
            const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
            const events = await this.__eventService.getEventsByDate(startOfDay,true,role!=="admin"?id:undefined);
            res.status(STATUS_CODE.OK).json({status: true, data: events});
        }catch(err){
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async updateEvent(req:Request, res:Response):Promise<void>{
        try{
            const { id } = req.params;
            const eventData: Partial<IEventType> = req.body;
            const updatedEvent = await this.__eventService.updateEvent(id, eventData);
            if (updatedEvent) {
                res.status(STATUS_CODE.OK).json({status: true, data: updatedEvent});
            } else {
                res.status(STATUS_CODE.NOT_FOUND).json({status: false, message: MESSAGE_CONST.NOT_FOUND});
            }
        }catch(err){
            console.log(err)
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async deleteEvent(req:Request, res:Response):Promise<void>{
        try {
            const { id } = req.params;
            const deleted = await this.__eventService.deleteEvent(id);
            if (deleted) {
                res.status(STATUS_CODE.OK).json({status: true, message: MESSAGE_CONST.SUCCESS});
            } else {
                res.status(STATUS_CODE.NOT_FOUND).json({status: false, message: MESSAGE_CONST.NOT_FOUND});
            }
        } catch (error) {
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async createStudent(req:CustomRequestType, res:Response):Promise<void>{
        try{
            const id = String(req.user?.id)
            const studentData: StudentData = req.body;
            studentData.staffId = id;
            await this.__eventService.createStudent(studentData);
            res.status(STATUS_CODE.CREATED).json({status: true, message: MESSAGE_CONST.CREATED});
        }catch(err){
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async getRecentEvents(req:CustomRequestType, res:Response):Promise<void>{
        try{
            const id = String(req.user?.id)
            const role = String(req.user?.role)
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const events = await this.__eventService.getRecentEvents(endOfDay,false,role!=="admin"?id:undefined);
            res.status(STATUS_CODE.OK).json({status: true, data: events});
        }catch(err){
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

    async getStudentByEventId(req:Request, res:Response):Promise<void>{
        try{
            const { eventId } = req.params;
            const {staffId = undefined} = req.params;
            const student = await this.__eventService.getStudentByEventId(eventId, staffId);
            if (student) {
                res.status(STATUS_CODE.OK).json({status: true, data: student});
            } else {
                res.status(STATUS_CODE.NOT_FOUND).json({status: false, message: MESSAGE_CONST.NOT_FOUND});
            }
        }catch(err){
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: false, message:MESSAGE_CONST.INTERNAL_SERVER_ERROR})
        }
    }

}