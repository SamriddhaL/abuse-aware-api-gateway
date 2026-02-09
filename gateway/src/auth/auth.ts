import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const users = [
        { username: 'alice', password: 'pass123', roles: ['user'] },
        { username: 'bob', password: 'adminpass', roles: ['admin'] }
    ];
@Injectable()
export class Auth {

    constructor(private jwtService: JwtService){}

    validateUser(user: {username: string, password: string}){
        const exactUser = users.find(u => u.username === user.username)
        if (!exactUser){
            return null
        }
        if (exactUser.password === user.password){  
            return user
        } 
        return null
    }

    login(user : {username : string}){
        const exactUser = users.find(u => u.username === user.username)
        const payload = {
            username : user.username,
            roles: exactUser!.roles,
        }
        const token = this.jwtService.sign(payload)
        return token
    }


}
