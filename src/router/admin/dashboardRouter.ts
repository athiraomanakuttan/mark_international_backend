import {Router} from 'express'
import { Request, Response } from 'express'
import DashboardLeadRepository from '../../repository/admin/dashboard/leadRepository'
import { DashboardLeadService } from '../../service/admin/dashboard/DashboardLeadService'
import { DashboardLeadController } from '../../controller/admin/dashboard/leadController'

const dashboardRepository = new DashboardLeadRepository()
const dashboardService = new DashboardLeadService(dashboardRepository)
const leadController = new DashboardLeadController(dashboardService)

const router = Router()

router.get('/lead',(req:Request, res:Response)=>leadController.getLeadData(req,res))
router.get('/staff-lead',(req:Request, res:Response)=>leadController.getStaffWiseReport(req,res))


export default router