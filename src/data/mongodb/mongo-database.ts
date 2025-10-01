import { Pool } from 'pg';

interface Options {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

export class MongoDatabase { // ← Mantener mismo nombre para compatibilidad
    private static pool: Pool;

    static async connect(options: Options): Promise<boolean> {
        try {
            this.pool = new Pool({
                host: options.host,
                port: options.port,
                database: options.database,
                user: options.user,
                password: options.password,
            });

            const client = await this.pool.connect();
            client.release();
            
            console.log('Connected to PostgreSQL');
            return true;
        } catch (error) {
            console.error('Error connecting to PostgreSQL:', error);
            throw error;
        }
    }

    static getPool(): Pool {
        if (!this.pool) {
            throw new Error('Database not connected');
        }
        return this.pool;
    }
}