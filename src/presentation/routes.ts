import { Router } from 'express';
import { AuthRoutes } from './auth/routes.js';

const router = Router();

// Usar las rutas de autenticación
router.use('/api/auth', AuthRoutes.routes);

export const AppRoutes = {
    routes: router,
};