import { CustumError, UserEntity } from "../../domain/index.js";



export class UserMapper {

 static userEntityFromObject(object:{[key:string]:any}){

    const {id,_id,name,email,password,roles}=object;  
    
    if( !_id && !id ){
        throw CustumError.badRequest('Missing user id');
    }

    if(!name)
        throw CustumError.badRequest('Missing user name');
    
    if(!email)
        throw CustumError.badRequest('Missing user email');
    
    if(!password)
        throw CustumError.badRequest('Missing user password');
    
    if(!roles)
        throw CustumError.badRequest('Missing user roles');
    

    return new UserEntity(
        id || _id.toString(), // Aseguramos que _id se convierta a string si está presente
        name,
        email,
        password,
        roles
    );   
 }


}