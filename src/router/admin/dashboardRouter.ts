import {NextFunction, Router} from 'express'
import { Request, Response } from 'express'
import DashboardLeadRepository from '../../repository/admin/dashboard/leadRepository'
import { DashboardLeadService } from '../../service/admin/dashboard/DashboardLeadService'
import { DashboardLeadController } from '../../controller/admin/dashboard/leadController'
import authenticationMiddleware from '../../middlewares/authenticationMiddleware'
import { adminAuthentication } from '../../middlewares/admin/adminAuthentication'

const dashboardRepository = new DashboardLeadRepository()
const dashboardService = new DashboardLeadService(dashboardRepository)
const leadController = new DashboardLeadController(dashboardService)

const router = Router()
router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: NextFunction) => void);


router.get('/lead',(req:Request, res:Response)=>leadController.getLeadData(req,res))
router.get('/staff-lead',(req:Request, res:Response)=>leadController.getStaffWiseReport(req,res))
router.get('/lead/month-wise-report', (req:Request, res:Response)=>leadController.getMonthWiseReport(req,res))


export default router