import { Router } from 'express';
import { DesignationController } from '../../controller/admin/designationController';
import { DesignationService } from '../../service/designationService';
import { DesignationRepository } from '../../repository/designationRepository';
import authenticationMiddleware from '../../middlewares/authenticationMiddleware';

const router = Router();

// Initialize dependencies
const designationRepository = new DesignationRepository();
const designationService = new DesignationService(designationRepository);
const designationController = new DesignationController(designationService);

// Routes
router.post('/', authenticationMiddleware, (req, res) => designationController.createDesignation(req, res));
router.get('/', authenticationMiddleware, (req, res) => designationController.getDesignations(req, res));
router.get('/active', authenticationMiddleware, (req, res) => designationController.getAllActiveDesignations(req, res));
router.get('/:id', authenticationMiddleware, (req, res) => designationController.getDesignationById(req, res));
router.put('/:id', authenticationMiddleware, (req, res) => designationController.updateDesignation(req, res));
router.delete('/:id', authenticationMiddleware, (req, res) => designationController.deleteDesignation(req, res));

export default router;