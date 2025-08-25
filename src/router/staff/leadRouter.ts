import {Router} from 'express'
import authenticationMiddleware from '../../middlewares/authenticationMiddleware'
import { Request,Response,NextFunction } from 'express'
import { LeadRepository } from '../../repository/staff/leadRepository'
import { LeadService } from '../../service/staff/LeadService'
import { LeadController } from '../../controller/staff/leadController'

import { LeadHistoryRepository } from '../../repository/LeadHistoryRepository'
import {LeadHistoryService} from '../../service/LeadHistoryService'


const leadRepository = new LeadRepository()
const leadService = new LeadService(leadRepository)

const leadHistoryRepository = new LeadHistoryRepository()
const leadHistoryService = new LeadHistoryService(leadHistoryRepository)

const leadController = new LeadController(leadService, leadHistoryService)

const router = Router()


router.use(authenticationMiddleware  as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.post('/',(req,res)=>leadController.createLead(req,res))
router.get('/', (req:Request, res:Response)=> leadController.getLead(req,res))
router.patch('/delete',(req:Request, res:Response)=> leadController.deleteMultipleLeads(req,res))

router.patch('/:id',(req:Request, res:Response)=> leadController.updateLead(req,res))

router.get('/export-lead',(req:Request, res:Response)=>leadController.getExportLead(req,res))
export default router