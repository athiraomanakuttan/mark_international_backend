import { Request, Response, Router, NextFunction } from "express";
import BranchController from "../../controller/branchController";
import { BranchRepository } from "../../repository/branchRepository";
import { BranchService } from "../../service/branchService";
import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import { adminAuthentication } from "../../middlewares/admin/adminAuthentication";

const router = Router();

// Initialize dependencies
const branchRepository = new BranchRepository();
const branchService = new BranchService(branchRepository);
const branchController = new BranchController(branchService);

// Apply authentication middlewares
router.use(authenticationMiddleware as unknown as (req: Request, res: Response, next: NextFunction) => void);
router.use(adminAuthentication as unknown as (req: Request, res: Response, next: NextFunction) => void);

// Branch routes
router.post('/', (req, res) => branchController.createBranch(req, res));
router.get('/', (req, res) => branchController.getBranches(req, res));
router.get('/search', (req, res) => branchController.searchBranches(req, res));
router.get('/:branchId', (req, res) => branchController.getBranchById(req, res));
router.put('/:branchId', (req, res) => branchController.updateBranch(req, res));
router.patch('/:branchId/status', (req, res) => branchController.updateBranchStatus(req, res));
router.delete('/:branchId', (req, res) => branchController.deleteBranch(req, res));

export default router;