import { Validators } from "../../../config/validator.js";

export class LoginUserDto {

    constructor(
        public email: string,
        public password:string,
    ){}
    static create(object:{[key:string]:any}):[string | undefined, LoginUserDto?]{
    
            const { email,password}= object;
            
            if(!email) return['Missing email'];
            if (!Validators.email.test(email)) return['Email is not valid'];
            if (!password) return ['Missing password'];
            if(password.length < 6) return['password too short'];
    
    
    
            return [
            undefined,
            new LoginUserDto(
                email,password
            )
            ];
        }
}