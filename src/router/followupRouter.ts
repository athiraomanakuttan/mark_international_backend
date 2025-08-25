import {NextFunction, Router,Request,Response} from 'express';
const router = Router();
import { FollowupController } from '../controller/followupController';
import { FollowupRepository } from '../repository/FollowupRepository';
import { FollowupService } from '../service/followupService';
import authenticationMiddleware from '../middlewares/authenticationMiddleware';

const followupRepository = new FollowupRepository();
const followupService = new FollowupService(followupRepository);
const followupController = new FollowupController(followupService);
router.use(authenticationMiddleware  as unknown as (req: Request, res: Response, next: NextFunction) => void);


router.post('/', (req, res) => followupController.createFollowup(req, res));
router.get('/', (req, res) => followupController.getAllFollowups(req, res));
router.patch('/', (req,res)=> followupController.updateFollowup(req,res));

export default router;