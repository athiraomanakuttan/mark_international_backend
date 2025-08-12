import { Request, Response, NextFunction, Router } from "express";
import { adminAuthentication } from "../../middlewares/admin/adminAuthentication";
const router = Router()
import  StaffRepository  from '../../repository/admin/staffRepository'
import { StaffService } from '../../service/admin/staffService'
import StaffController from '../../controller/admin/staffController'
import { upload } from '../../middlewares/multer'
import authenticationMiddleware from '../../middlewares/authenticationMiddleware'
import { LeadController } from "../../controller/leadController";
const staffRepository = new StaffRepository()
const staffService = new StaffService(staffRepository)
const staffController = new StaffController(staffService)

router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.post('/', upload.single('profilePic'), (req:Request, res:Response) => staffController.createStaff(req, res))
router.get('/', (req:Request, res:Response) => staffController.getActiveStaff(req, res))
router.patch('/:id', upload.single('profilePic'), (req:Request, res:Response) => staffController.updateStaff(req, res))
router.patch('/:id/:status', (req:Request, res:Response) => staffController.updateStaffStatus(req, res))
router.get('/get-all-active', (req:Request,res:Response)=> staffController.getAllActive(req,res))

export default router 