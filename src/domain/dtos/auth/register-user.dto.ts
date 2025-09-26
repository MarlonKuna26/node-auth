import { Validators } from "../../../config/validator.js";


export class RegisterUserDtos{
   
    private constructor(

        public name: string,
        public email: string,
        public password:string,

    ){}

    static create(object:{[key:string]:any}):[string | undefined, RegisterUserDtos?]{

        const {name, email,password}= object;
        if(!name) return['Missing name'];
        if(!email) return['Missing email'];
        if (!Validators.email.test(email)) return['Email is not valid'];
        if (!password) return ['Missing password'];
        if(password.length < 6) return['password too short'];



        return [
        undefined,
        new RegisterUserDtos(
            name, email,password
        )
        ];
    }


}