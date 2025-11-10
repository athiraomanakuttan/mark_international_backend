import { Router } from 'express';
import { AdminResignationController } from '../../controller/admin/resignationController';
import authenticationMiddleware from '../../middlewares/authenticationMiddleware';

const router = Router();
const resignationController = new AdminResignationController();

// Admin resignation routes
// GET /admin/resignations - Get all resignations with pagination and status filter
router.get('/', 
  authenticationMiddleware, 
  resignationController.getResignations
);

// GET /admin/resignations/:id - Get resignation by ID
router.get('/:id',
  authenticationMiddleware,
  resignationController.getResignationById
);

// PUT /admin/resignations/:id/review - Approve or reject resignation (status: 1=approve, 2=reject)
router.put('/:id/review',
  authenticationMiddleware,
  resignationController.reviewResignation
);

// PATCH /admin/resignations/:id/review - Approve or reject resignation (status: 1=approve, 2=reject)
router.patch('/:id/review',
  authenticationMiddleware,
  resignationController.reviewResignation
);

// PUT /admin/resignations/:id/approve - Approve resignation
router.put('/:id/approve',
  authenticationMiddleware,
  resignationController.approveResignation
);

// PUT /admin/resignations/:id/reject - Reject resignation
router.put('/:id/reject',
  authenticationMiddleware,
  resignationController.rejectResignation
);


export default router;