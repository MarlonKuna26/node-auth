import type { LoginUserDto } from "../dtos/auth/login-user.dto.js";
import type { RegisterUserDtos } from "../dtos/auth/register-user.dto.js";
import type { UserEntity } from "../entities/user.entity.js";


export abstract class AuthDatasource{

    // abstract login 
    //todo
    abstract login(loginUserDtos:LoginUserDto):Promise<UserEntity>;
    // abstract login(lo)

     abstract register(registerUserDtos:RegisterUserDtos):Promise<UserEntity>

}