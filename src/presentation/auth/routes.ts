import { Router } from 'express';
import { AuthController } from './controller.js';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '../../infrastructure/index.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';


const router = Router();
const datasource=new AuthDataSourceImpl();
const authRepository=new AuthRepositoryImpl(datasource);
const authController = new AuthController(authRepository);

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/', [AuthMiddleware.validateJWT], authController.getUsers);

export const AuthRoutes = {
    routes: router,
};