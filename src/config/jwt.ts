import jwt from 'jsonwebtoken';
import { envs } from './envs.js';

const JWT_SEED = envs.JWT_SEED; 


export class JwtAdapter {
    
   static async generateToken(
    payload: Object,
    duration: string = '2h'):Promise<string|null> {

    try {
        const token = (jwt as any).sign(payload, JWT_SEED, { expiresIn: duration });
        return token;
    } catch (error) {
        return null;
    }
   }   
   
   
   static validateToken<T>(token: string): Promise<T | null> {
   
    return new Promise((resolve) => {
        (jwt as any).verify(token, JWT_SEED, (err: any, decoded: T) => {
            if (err) return resolve(null);
            resolve(decoded as T);
        });
    });
   }
}