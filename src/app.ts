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

    await MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    });

    new Server({
        port: envs.PORT,
        routes: AppRoutes.routes  
    }).start();
}