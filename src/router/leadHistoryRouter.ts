import {Router} from 'express'
import { Request, Response } from 'express'
import { LeadHistoryRepository } from '../repository/LeadHistoryRepository'
import { LeadHistoryService } from '../service/LeadHistoryService'
import {LeadHistoryController} from '../controller/leadHistoryController'

import { LeadService } from '../service/LeadService'
import { LeadRepository } from '../repository/leadRepository'

const leadHistoryRepository = new LeadHistoryRepository()
const leadHistoryService = new LeadHistoryService(leadHistoryRepository)

const leadRepository = new LeadRepository()
const leadService = new LeadService(leadRepository)


const leadHistoryController = new LeadHistoryController(leadHistoryService, leadService)


const router = Router()


router.get('/:leadId', (req:Request, res:Response) => leadHistoryController.getAllLeadHistory(req,res))

router.get('/lead/:id', (req:Request, res:Response) => leadHistoryController.getLeadById(req,res))

export default router