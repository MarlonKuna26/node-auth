import { BcryptAdapter } from "../../config/bcrypt.js";
import { PostgresUserModel } from "../../data/postgresql/index.js";
import type { AuthDatasource } from "../../domain/datasources/auth.datasource.js";
import { CustumError, LoginUserDto, UserEntity, type RegisterUserDtos } from "../../domain/index.js";
import { UserMapper } from "../mappers/user.mapper.js";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDataSourcePostgresImpl implements AuthDatasource {
    
    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    ) {}

    async login(loginUserDtos: LoginUserDto): Promise<UserEntity> {
        const { email, password } = loginUserDtos;

        try {
            console.log('PostgreSQL Login attempt with email:', email);
            const user = await PostgresUserModel.findOne({ email });
            console.log('PostgreSQL User found:', user);
            
            if (!user) throw CustumError.badRequest('User does not exist');

            const isMatching = this.comparePassword(password, user.password);
            console.log('PostgreSQL Password match:', isMatching);
            
            if (!isMatching) throw CustumError.badRequest('Password is not valid');

            // Mapear para compatibilidad
            const mappedUser = {
                ...user,
                id: user.id.toString(), // PostgreSQL usa number, convertir a string
            };

            return UserMapper.userEntityFromObject(mappedUser);
        } catch (error) {
            console.error('Error in AuthDataSourcePostgresImpl.login:', error);
            if (error instanceof CustumError) {
                throw error;
            }
            throw CustumError.internalServer();
        }
    }

    async register(registerUserDtos: RegisterUserDtos): Promise<UserEntity> {
        const { name, email, password } = registerUserDtos;

        try {
            const exists = await PostgresUserModel.findOne({ email });
            if (exists) throw CustumError.badRequest('User already exists');

            const user = await PostgresUserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password),
            });

            return new UserEntity(
                user.id.toString(), // Convertir a string para compatibilidad
                name,
                email,
                user.password,
                user.roles,
            );

        } catch (error) {
            if (error instanceof CustumError) {
                throw error;
            }
            console.error('Error in AuthDataSourcePostgresImpl.register:', error);
            throw CustumError.internalServer();
        }
    }
}