import { Body, Controller, Get, Param, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Auth } from './auth';
import { JwtGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly Auth: Auth){}
    @Post('login')
    login(@Body() user : {username: string, password: string} ){
        const validateUser = this.Auth.validateUser(user)
        if (!validateUser){
            throw new UnauthorizedException('User not Found')
        }
        const token = this.Auth.login({username: user.username})
        return token
    }

    @UseGuards(JwtGuard)
    @Get('test')
    test(){
        return 'valid' 
    }
}
