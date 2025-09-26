import type { RegisterUserDtos } from "../../dtos/auth/register-user.dto.js";
import type { AuthRepository } from "../../repositories/auth.repository.js";
import { JwtAdapter } from "../../../config/jwt.js";
import { CustumError } from "../../errors/custom.error.js";
import type { LoginUserDto } from "../../dtos/auth/login-user.dto.js";

interface UserToken{
    token:string;
    user:{
        id:string;
        name:string;
        email:string;
    }

}

type SignToken=(payload:Object,duration?:string) => Promise<string | null>;

interface LoginUserUseCase{
    execute(registerUserDtos: RegisterUserDtos): Promise<UserToken>;

}

export class LoginUser implements LoginUserUseCase{
    
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdapter.generateToken
    ){}
    
    
    async execute(loginUserDtos: LoginUserDto): Promise<UserToken> {
        try {
            const user = await this.authRepository.login(loginUserDtos);
            if (!user) throw CustumError.notFound('User not found');

            const token = await this.signToken({ id: user.id }, '2h');
            if (!token) throw CustumError.internalServer('Error generating token');

            return {
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            };
        } catch (error) {
            throw error;
        }
    }

}
