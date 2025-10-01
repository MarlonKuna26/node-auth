import { envs } from './config/index.js';
import { MongoDatabase } from './data/mongodb/index.js';        // ← MANTENER
import { PostgresDatabase } from './data/postgresql/index.js';   // ← AGREGAR
import { AppRoutes } from './presentation/routes.js';
import { Server } from './presentation/server.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
    await main();
})();

async function main() {

    // Conectar MongoDB (mantener)
    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    // Conectar PostgreSQL (agregar)
    await PostgresDatabase.connect({
        host: envs.POSTGRES_HOST,
        port: envs.POSTGRES_PORT,
        database: envs.POSTGRES_DB_NAME,
        user: envs.POSTGRES_USER,
        password: envs.POSTGRES_PASSWORD
    });

    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    }).start();
}