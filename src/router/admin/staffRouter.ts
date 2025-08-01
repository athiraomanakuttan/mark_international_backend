import {Router} from 'express'
const router = Router()
import  StaffRepository  from '../../repository/admin/staffRepository'
import { StaffService } from '../../service/admin/staffService'
import StaffController from '../../controller/admin/staffController'
import { upload } from '../../middlewares/multer'
const staffRepository = new StaffRepository()
const staffService = new StaffService(staffRepository)
const staffController = new StaffController(staffService)

router.post('/',upload.single('profilePic'), (req, res) => staffController.createStaff(req, res))

export default router 