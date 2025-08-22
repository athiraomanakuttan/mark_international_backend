import {Router} from 'express';
const router = Router();
import { FollowupController } from '../controller/followupController';
import { FollowupRepository } from '../repository/FollowupRepository';
import { FollowupService } from '../service/followupService';

const followupRepository = new FollowupRepository();
const followupService = new FollowupService(followupRepository);
const followupController = new FollowupController(followupService);

router.post('/', (req, res) => followupController.createFollowup(req, res));

export default router;