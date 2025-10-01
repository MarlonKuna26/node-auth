import { Pool } from 'pg';

interface PostgresOptions {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}

export class PostgresDatabase {
    private static pool: Pool;

    static async connect(options: PostgresOptions): Promise<boolean> {
        try {
            this.pool = new Pool({
                host: options.host,
                port: options.port,
                database: options.database,
                user: options.user,
                password: options.password,
            });

            // Probar conexión
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
            throw new Error('PostgreSQL not connected');
        }
        return this.pool;
    }

    static async disconnect(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            console.log('PostgreSQL connection closed');
        }
    }
}