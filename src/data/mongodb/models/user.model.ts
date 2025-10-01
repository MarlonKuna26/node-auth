import { Pool } from 'pg';
import { MongoDatabase } from '../mongo-database.js'; // ← Reutilizar el archivo renombrado

export interface UserRow {
    id: number;
    name: string;
    email: string;
    password: string;
    img?: string;
    roles: string[];
    created_at: Date;
    updated_at: Date;
}

export class UserModel { // ← Mantener mismo nombre
    private static get pool(): Pool {
        return MongoDatabase.getPool();
    }

    static async findOne(criteria: { email?: string }): Promise<UserRow | null> {
        try {
            const { email } = criteria;
            const query = 'SELECT * FROM users WHERE email = $1';
            const result = await this.pool.query(query, [email]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error in findOne:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<UserRow | null> {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const result = await this.pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    static async find(): Promise<UserRow[]> {
        try {
            const result = await this.pool.query('SELECT * FROM users ORDER BY id');
            return result.rows;
        } catch (error) {
            console.error('Error in find:', error);
            throw error;
        }
    }

    static async create(userData: {
        name: string;
        email: string;
        password: string;
        img?: string;
        roles?: string[];
    }): Promise<UserRow & { id: string; save: () => Promise<UserRow> }> {
        try {
            const { name, email, password, img, roles = ['USER_ROLE'] } = userData;
            
            const query = `
                INSERT INTO users (name, email, password, img, roles) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *
            `;
            
            const result = await this.pool.query(query, [name, email, password, img, roles]);
            const user = result.rows[0];
            
            // Compatibilidad con código existente
            return {
                ...user,
                id: user.id.toString(), // Convertir a string para compatibilidad
                save: async () => user, // Mock del método save
                roles: user.roles || ['USER_ROLE']
            };
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    // Método para compatibilidad con Mongoose (toObject)
    toObject() {
        return { ...this };
    }
}