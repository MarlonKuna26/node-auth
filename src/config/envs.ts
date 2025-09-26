import 'dotenv/config';
import envVar from 'env-var';

export const envs = {
    PORT: envVar.get('PORT').required().asPortNumber(),
    MONGO_URL: envVar.get('MONGO_URL').required().asString(),
    MONGO_DB_NAME: envVar.get('MONGO_DB_NAME').required().asString(),
    JWT_SEED: envVar.get('JWT_SEED').required().asString(), // Se agregó JWT_SEED
};