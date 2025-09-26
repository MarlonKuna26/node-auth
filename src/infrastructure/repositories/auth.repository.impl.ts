import type { AuthDatasource, AuthRepository, LoginUserDto, RegisterUserDtos, UserEntity } from "../../domain/index.js";

export class AuthRepositoryImpl implements AuthRepository{
    
    constructor(
        private readonly authDatasource: AuthDatasource,
    ){}
    login(loginUserDtos: LoginUserDto): Promise<UserEntity> {
        return this.authDatasource.login(loginUserDtos);
    }
    
    
    register(registerUserDtos: RegisterUserDtos): Promise<UserEntity> {
        return this.authDatasource.register(registerUserDtos);
    }

}