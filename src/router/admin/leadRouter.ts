import {Router} from 'express'
import {LeadRepository} from '../../repository/leadRepository'
import { LeadService } from '../../service/LeadService'
import { LeadController } from '../../controller/leadController'
import authenticationMiddleware from '../../middlewares/authenticationMiddleware'
import { adminAuthentication } from '../../middlewares/admin/adminAuthentication'
import { Request,Response,NextFunction } from 'express'
import { TransferRepository } from '../../repository/transferRepository'
import { TransferLeadService } from '../../service/TransferLeadService'
import { TransferController } from '../../controller/TransferController'

const transferRepository = new TransferRepository()
const transferService = new TransferLeadService(transferRepository)

const leadRepository = new LeadRepository()
const leadService = new LeadService(leadRepository)
const leadController = new LeadController(leadService, transferService)

const router = Router()


router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.post('/',(req,res)=>leadController.createLead(req,res))
router.get('/', (req:Request, res:Response)=> leadController.getLead(req,res))
router.post('/upload', (req:Request, res:Response)=>leadController.createBulkLead(req,res))
router.patch('/transfer', (req:Request,res:Response)=> leadController.transferLead(req, res))
router.get('/unassigned', (req:Request,res:Response)=> leadController.getUnassignedLead(req, res))
router.patch('/assign', (req:Request, res:Response)=> leadController.leadAssignToStaff(req,res))
router.patch('/delete',(req:Request, res:Response)=> leadController.deleteMultipleLeads(req,res))

router.patch('/:id',(req:Request, res:Response)=> leadController.updateLead(req,res))
export default router