import 'dotenv/config';
import envVar from 'env-var';

export const envs = {

    //MongoDB
    PORT: envVar.get('PORT').required().asPortNumber(),
    MONGO_URL: envVar.get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: envVar.get('MONGO_DB_NAME').required().asString(),

    // PostgreSQL (agregar)
    POSTGRES_HOST: envVar.get('POSTGRES_HOST').required().asString(),
    POSTGRES_PORT: envVar.get('POSTGRES_PORT').required().asPortNumber(),
    POSTGRES_DB_NAME: envVar.get('POSTGRES_DB_NAME').required().asString(),
    POSTGRES_USER: envVar.get('POSTGRES_USER').required().asString(),
    POSTGRES_PASSWORD: envVar.get('POSTGRES_PASSWORD').required().asString(),
    

    JWT_SEED: envVar.get('JWT_SEED').required().asString(), // Se agregó JWT_SEED
};