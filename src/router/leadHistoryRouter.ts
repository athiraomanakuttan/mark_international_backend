import {Router} from 'express'
import { Request, Response } from 'express'
import { LeadHistoryRepository } from '../repository/LeadHistoryRepository'
import { LeadHistoryService } from '../service/LeadHistoryService'
import {LeadHistoryController} from '../controller/leadHistoryController'
const leadHistoryRepository = new LeadHistoryRepository()
const leadHistoryService = new LeadHistoryService(leadHistoryRepository)
const leadHistoryController = new LeadHistoryController(leadHistoryService)
const router = Router()


router.get('/:leadId', (req:Request, res:Response) => leadHistoryController.getAllLeadHistory(req,res))

export default router