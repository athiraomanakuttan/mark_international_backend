import Router  from 'express'
const router = Router();
import { AuthRepository } from '../repository/authRepository';
import { AuthService } from '../service/authService';
import { AuthController } from '../controller/authController';

const authRepository = new AuthRepository()
const authService = new AuthService(authRepository)
const authController = new AuthController(authService)

router.post('/login', (req, res) => authController.userLogin(req, res));

export default router; 