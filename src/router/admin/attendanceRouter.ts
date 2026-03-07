import { Request, Response, NextFunction, Router } from "express";
import { LeaveRepository } from "../../repository/leaveRepository";
import { LeaveService } from "../../service/leaveService";
import { LeaveController } from "../../controller/leaveController";
import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import { adminAuthentication } from "../../middlewares/admin/adminAuthentication";

const router = Router();

const leaveRepository = new LeaveRepository();
const leaveService = new LeaveService(leaveRepository);
const leaveController = new LeaveController(leaveService);

router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: NextFunction) => void);

router.get("/staff-attendance", (req, res) => leaveController.getAllStaffAttendance(req, res));
router.post("/mark-absent", (req, res) => leaveController.markStaffAbsent(req, res));
router.post("/remove-absent", (req, res) => leaveController.removeStaffAbsent(req, res));

export default router;
