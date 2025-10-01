import { envs } from './config/index.js';
import { MongoDatabase } from './data/mongodb/index.js';
import { AppRoutes } from './presentation/routes.js';
import {Server } from './presentation/server.js';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json()); // Necesario para manejar JSON en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Agregado para manejar x-www-form-urlencoded




(async () => {
    await main();
})();

async function main () {

    // Cambiar la llamada a connect:
await MongoDatabase.connect({
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