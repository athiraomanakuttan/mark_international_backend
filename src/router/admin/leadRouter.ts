import {Router} from 'express'
import {LeadRepository} from '../../repository/admin/leadRepository'
import { LeadService } from '../../service/admin/LeadService'
import { LeadController } from '../../controller/admin/leadController'
import authenticationMiddleware from '../../middlewares/authenticationMiddleware'
import { adminAuthentication } from '../../middlewares/admin/adminAuthentication'
import { Request,Response,NextFunction } from 'express'

const leadRepository = new LeadRepository()
const leadService = new LeadService(leadRepository)
const leadController = new LeadController(leadService)

const router = Router()


router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.post('/',(req,res)=>leadController.createLead(req,res))

export default router