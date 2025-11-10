import { Router } from 'express';
import { StaffResignationController } from '../../controller/staff/resignationController';
import authenticationMiddleware from '../../middlewares/authenticationMiddleware';
import { uploadResignationDocument } from '../../middlewares/cloudinaryMulter';

const router = Router();
const resignationController = new StaffResignationController();

// Staff resignation routes
// POST /staff/resignation - Create new resignation
router.post('/', 
  authenticationMiddleware, 
  ...uploadResignationDocument, 
  resignationController.createResignation
);

// GET /staff/resignation - Get user's resignation (expects single resignation, not array)
router.get('/', 
  authenticationMiddleware, 
  resignationController.getMyResignations
);

// PUT /staff/resignation/:id - Update resignation
router.put('/:id', 
  authenticationMiddleware, 
  ...uploadResignationDocument, 
  resignationController.updateResignation
);

// DELETE /staff/resignation/:id - Delete resignation
router.delete('/:id', 
  authenticationMiddleware, 
  resignationController.deleteResignation
);

export default router;