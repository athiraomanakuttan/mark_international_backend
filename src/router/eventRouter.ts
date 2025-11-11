import {Router} from 'express'
import { EventController } from '../controller/eventController'
import { EventService } from '../service/EventService'
import { EventRepository } from '../repository/EventRepository'
import {Request,Response,NextFunction} from 'express'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'
const router = Router()

const eventRepository = new EventRepository();
const eventService = new EventService(eventRepository);
const eventController = new EventController(eventService);

router.use(authenticationMiddleware  as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.post('/', (req, res) => eventController.createEvent(req, res));
router.get('/all',(req,res)=>eventController.getAllEvents(req,res))
router.get('/upcoming',(req,res)=>eventController.getUpcomingEvents(req,res))
router.get('/status/upcoming',(req,res)=>eventController.getUpcomingEventsByStatus(req,res))
router.get('/status/ongoing',(req,res)=>eventController.getOngoingEventsByStatus(req,res))
router.get('/status/past',(req,res)=>eventController.getPastEventsByStatus(req,res))
router.patch('/update/:id',(req,res)=>eventController.updateEvent(req,res))
router.delete('/:id',(req,res)=>eventController.deleteEvent(req,res))
router.get('/recent',(req,res)=>eventController.getRecentEvents(req,res))
router.get('/data/:eventId',(req,res)=>eventController.getStudentByEventId(req,res))

router.post('/student',(req,res)=>eventController.createStudent(req,res))


export default router