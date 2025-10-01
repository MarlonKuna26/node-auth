import { Pool } from 'pg';
import { PostgresDatabase } from '../postgres-database.js';

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

export class PostgresUserModel {
    private static get pool(): Pool {
        return PostgresDatabase.getPool();
    }

    static async findOne(criteria: { email?: string; id?: number }): Promise<UserRow | null> {
        try {
            const { email, id } = criteria;
            let query = 'SELECT * FROM users WHERE ';
            let params: any[] = [];

            if (email) {
                query += 'email = $1';
                params = [email];
            } else if (id) {
                query += 'id = $1';
                params = [id];
            } else {
                throw new Error('Email or ID required');
            }

            const result = await this.pool.query(query, params);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error in findOne:', error);
            throw error;
        }
    }

    static async findById(id: number): Promise<UserRow | null> {
        return this.findOne({ id });
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
    }): Promise<UserRow> {
        try {
            const { name, email, password, img, roles = ['USER_ROLE'] } = userData;
            
            const query = `
                INSERT INTO users (name, email, password, img, roles) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING *
            `;
            
            const result = await this.pool.query(query, [name, email, password, img, roles]);
            return result.rows[0];
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    // Método save para compatibilidad
    static async save(userData: UserRow): Promise<UserRow> {
        // En PostgreSQL no necesitamos save separado, create ya devuelve el objeto
        return userData;
    }

    // Propiedades para compatibilidad con Mongoose
    static toObject(user: UserRow) {
        return { ...user, _id: user.id };
    }
}