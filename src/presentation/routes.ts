import { Router } from 'express';
import { AuthRoutes } from './auth/routes.js';                    // ← MongoDB (mantener)
import { AuthPostgresRoutes } from './auth/routes.postgres.js';   // ← PostgreSQL (agregar)

const router = Router();

// MongoDB routes (mantener)
router.use('/api/auth/mongo', AuthRoutes.routes);

// PostgreSQL routes (agregar)
router.use('/api/auth/postgres', AuthPostgresRoutes.routes);

export const AppRoutes = {
    routes: router,
};