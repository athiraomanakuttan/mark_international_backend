import { Router, Request, Response, NextFunction } from "express"
import { DashboardLeadController } from "../../controller/staff/dashboardLeadController"
import DashboardLeadRepository from "../../repository/staff/DashboardLeadRepository"
import { DashboardLeadService } from "../../service/staff/DashboardLeadService"
import authenticationMiddleware from "../../middlewares/authenticationMiddleware"


const dashboardRepository = new DashboardLeadRepository()
const dashboardService = new DashboardLeadService(dashboardRepository)
const leadController = new DashboardLeadController(dashboardService)

const router = Router()

router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.get('/lead',(req:Request, res:Response)=>leadController.getLeadData(req,res))
router.get('/staff-lead',(req:Request, res:Response)=>leadController.getStaffWiseReport(req,res))



export default router