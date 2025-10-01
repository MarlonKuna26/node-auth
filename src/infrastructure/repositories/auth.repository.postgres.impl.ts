import type { AuthRepository } from "../../domain/repositories/auth.repository.js";
import type { AuthDatasource } from "../../domain/datasources/auth.datasource.js";
import type { LoginUserDto } from "../../domain/dtos/auth/login-user.dto.js";
import type { RegisterUserDtos } from "../../domain/dtos/auth/register-user.dto.js";
import type { UserEntity } from "../../domain/entities/user.entity.js";

export class AuthRepositoryPostgresImpl implements AuthRepository {

    constructor(
        private readonly authDatasource: AuthDatasource,
    ) {}

    login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.authDatasource.login(loginUserDto);
    }

    register(registerUserDto: RegisterUserDtos): Promise<UserEntity> {
        return this.authDatasource.register(registerUserDto);
    }
}