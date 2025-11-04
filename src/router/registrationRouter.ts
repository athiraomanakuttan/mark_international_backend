import Router from 'express';
import { RegistrationRepository } from '../repository/registrationRepository';
import { RegistrationService } from '../service/registrationService';
import { RegistrationController } from '../controller/registrationController';
import { uploadMultiple } from '../middlewares/registrationMulter';

const router = Router();

// Initialize dependencies
const registrationRepository = new RegistrationRepository();
const registrationService = new RegistrationService(registrationRepository);
const registrationController = new RegistrationController(registrationService);

// Routes
router.post('/registration', 
  // accept any file fields (we'll filter by fieldname in the controller)
  uploadMultiple.any(), 
  (req, res) => registrationController.createRegistration(req, res)
);

router.get('/registration/:id', 
  (req, res) => registrationController.getRegistrationById(req, res)
);

router.get('/registrations', 
  (req, res) => registrationController.getAllRegistrations(req, res)
);

router.patch('/registration/:id/status', 
  (req, res) => registrationController.updateRegistrationStatus(req, res)
);

router.delete('/registration/:id', 
  (req, res) => registrationController.deleteRegistration(req, res)
);

export default router;