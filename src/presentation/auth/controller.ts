import type { Request, Response } from 'express';
import { AuthRepository, CustumError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDtos } from '../../domain/index.js';
import { UserModel } from '../../data/mongodb/index.js';

export class AuthController{
    constructor(
        private readonly authRepository: AuthRepository,
    ){}

    private handleError=(error:unknown,res: Response)=>{
        if(error instanceof CustumError){
            return res.status(error.statusCode).json({ error: error.message });
        }
        console.log('Unhandled error:', error); // Depuración
        return res.status(500).json({ error: 'Internal server error'});
    }

    registerUser =  (req: Request, res: Response) => {
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const [error, registerUserDtos] = RegisterUserDtos.create(req.body);
        if (error) {
            return res.status(400).json({ error });
        }

        new RegisterUser(this.authRepository)
            .execute(registerUserDtos!)
            .then(data => res.json(data))
            .catch(error => this.handleError(error, res)); 
    };
    loginUser = (req: Request, res: Response) => {
        console.log('Request body:', req.body); // Depuración
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) {
            return res.status(400).json({ error });
        }

        new LoginUser(this.authRepository)
            .execute(loginUserDto!)
            .then(data => res.json(data))
            .catch(error => this.handleError(error, res));
    };

    getUsers = (req: Request, res: Response) => {
        UserModel.find()
            .then(users => res.json(users))
            .catch(() => res.status(500).json({ error: 'Internal server error' }));
    };
}

