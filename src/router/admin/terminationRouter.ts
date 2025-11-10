import { Router } from 'express';
import { AdminTerminationController } from '../../controller/admin/terminationController';
import authenticationMiddleware from '../../middlewares/authenticationMiddleware';

const router = Router();
const terminationController = new AdminTerminationController();

// Admin termination routes
// GET /admin/terminations - Get all terminations with pagination and filters
router.get('/', 
  authenticationMiddleware, 
  terminationController.getTerminations
);

// GET /admin/terminations/active-staff - Get active staff list
router.get('/active-staff',
  authenticationMiddleware,
  terminationController.getActiveStaff
);

// GET /admin/terminations/active-employees - Get active employees list
router.get('/active-employees',
  authenticationMiddleware,
  terminationController.getActiveEmployees
);

// GET /admin/terminations/:id - Get termination by ID
router.get('/:id',
  authenticationMiddleware,
  terminationController.getTerminationById
);

// POST /admin/terminations - Create new termination
router.post('/',
  authenticationMiddleware,
  terminationController.createTermination
);

export default router;
