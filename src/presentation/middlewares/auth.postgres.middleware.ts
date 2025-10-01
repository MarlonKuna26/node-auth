import type { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config/jwt.js";
import { PostgresUserModel } from "../../data/postgresql/index.js";

export class AuthPostgresMiddleware {

    static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
        
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(401).json({ error: 'No token provided' });
        
        if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid token format' });
        
        const token = authorization.split(' ').at(1) || '';
        try {

            const payload = await JwtAdapter.validateToken<{ id: string }>(token);
            if (!payload) return res.status(401).json({ error: 'Invalid token' });

            // Convertir string id a number para PostgreSQL
            const userId = parseInt(payload.id);
            const user = await PostgresUserModel.findById(userId);
            if (!user) return res.status(401).json({ error: 'invalid token - user not found' });

            // Aseguramos que req.body sea un objeto válido
            req.body = req.body || {};
            req.body.user = user;

            next();

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}