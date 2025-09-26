import { BcryptAdapter } from "../../config/bcrypt.js";
import { UserModel } from "../../data/mongodb/index.js";
import type { AuthDatasource } from "../../domain/datasources/auth.datasource.js";
import { CustumError, LoginUserDto, UserEntity, type RegisterUserDtos } from "../../domain/index.js";
import { UserMapper } from "../mappers/user.mapper.js";


type HashFunction = (password:string) => string;
type CompareFunction = (password:string,hashed:string) => boolean;


export class AuthDataSourceImpl implements AuthDatasource{
    
    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    ){}
    async login(loginUserDtos: LoginUserDto): Promise<UserEntity> {
        const { email, password } = loginUserDtos;

        try {
            console.log('Login attempt with email:', email); // Depuración
            const user = await UserModel.findOne({ email });
            console.log('User found:', user); // Depuración
            if (!user) throw CustumError.badRequest('User does not exist');

            const isMatching = this.comparePassword(password, user.password);
            console.log('Password match:', isMatching); // Depuración
            if (!isMatching) throw CustumError.badRequest('Password is not valid');

            const mappedUser = {
                ...user.toObject(),
                id: user._id.toString(),
            };

            return UserMapper.userEntityFromObject(mappedUser);
        } catch (error) {
            console.error('Error in AuthDataSourceImpl.login:', error); // Depuración
            throw CustumError.internalServer();
        }

    }

    
    async register(registerUserDtos: RegisterUserDtos): Promise<UserEntity> {
        const { name, email, password } = registerUserDtos;

        try {
            const exists = await UserModel.findOne({ email });
            if (exists) throw CustumError.badRequest('User already exists');

            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password),
                
            });

            await user.save();

            return new UserEntity(
                user.id,
                name,
                email,
                user.password,
                user.roles,
            );


    } catch(error) {
        if (error instanceof CustumError) {
            throw error;
        }
        throw CustumError.internalServer();
    }
    }
}