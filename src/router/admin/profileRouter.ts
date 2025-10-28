import { Request,Response, Router , NextFunction, RequestHandler} from "express";
import ProfileController from "../../controller/admin/profileController";
import { AuthRepository } from '../../repository/authRepository';
import { AuthService } from '../../service/authService';
import authenticationMiddleware from '../../middlewares/authenticationMiddleware'
import { adminAuthentication } from '../../middlewares/admin/adminAuthentication'

const router = Router()


const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const profileController = new ProfileController(authService)

router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.put('/reset-password', (req, res) => profileController.changePassword(req, res)); 



export default router