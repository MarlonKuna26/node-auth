import { Router } from 'express';
import { AuthPostgresController } from './controller.postgres.js';
import { AuthDataSourcePostgresImpl, AuthRepositoryPostgresImpl } from '../../infrastructure/index.js';
import { AuthPostgresMiddleware } from '../middlewares/auth.postgres.middleware.js';

const router = Router();
const datasource = new AuthDataSourcePostgresImpl();
const authRepository = new AuthRepositoryPostgresImpl(datasource);
const authController = new AuthPostgresController(authRepository);

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/', [AuthPostgresMiddleware.validateJWT], authController.getUsers);

export const AuthPostgresRoutes = {
    routes: router,
};