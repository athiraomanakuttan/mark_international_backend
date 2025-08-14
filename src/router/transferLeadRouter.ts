import Router from 'express'
import { TransferRepository } from '../repository/transferRepository'
import { TransferLeadService } from '../service/TransferLeadService'
import { TransferController } from '../controller/TransferController'
import { Request,Response } from 'express'
import { adminAuthentication } from '../middlewares/admin/adminAuthentication'
import authenticationMiddleware from '../middlewares/authenticationMiddleware'
const transferRepository = new TransferRepository()
const transferService = new TransferLeadService(transferRepository)
const transferController = new TransferController(transferService)


const router =  Router()

router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: Function) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: Function) => void);



 router.get('/', (req:Request, res:Response)=> transferController.getTransferList(req,res))



export default router