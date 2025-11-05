import Router from 'express';
import { LeaveRepository } from '../repository/leaveRepository';
import { LeaveService } from '../service/leaveService';
import { LeaveController } from '../controller/leaveController';
import { upload } from '../middlewares/multer';

const router = Router();

const leaveRepository = new LeaveRepository();
const leaveService = new LeaveService(leaveRepository);
const leaveController = new LeaveController(leaveService);


router.post('/leave', 
  upload.any(), 
  (req, res) => leaveController.createLeave(req, res)
);

router.get('/leave/:id', 
  (req, res) => leaveController.getLeaveById(req, res)
);

router.patch('/leave/:id/status', 
  (req, res) => leaveController.updateLeaveStatus(req, res)
);

router.delete('/leave/:id', 
  (req, res) => leaveController.deleteLeave(req, res)
);

router.get('/leaves', 
  (req, res) => leaveController.getAllLeaves(req, res)
);

router.get('/leaves/user/:userId', 
  (req, res) => leaveController.getLeavesByUserId(req, res)
);

router.get('/leaves/status/:status', 
  (req, res) => leaveController.getLeavesByStatus(req, res)
);

router.get('/leaves/date-range', 
  (req, res) => leaveController.getLeavesByDateRange(req, res)
);

router.get('/leaves/stats', 
  (req, res) => leaveController.getLeaveStats(req, res)
);

router.get('/leaves/summary/monthly', 
  (req, res) => leaveController.getMonthlyLeaveSummary(req, res)
);

export default router;