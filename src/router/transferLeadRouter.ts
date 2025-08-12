import Router from 'express'
import { TransferRepository } from '../repository/transferRepository'
import { TransferLeadService } from '../service/TransferLeadService'
import { TransferController } from '../controller/TransferController'
import { Request,Response } from 'express'
const transferRepository = new TransferRepository()
const transferService = new TransferLeadService(transferRepository)
const transferController = new TransferController(transferService)


const router =  Router()




export default router