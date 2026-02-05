import { Controller, Get, Req, Res } from '@nestjs/common';
import axios from 'axios';
import type { Request, Response } from 'express';

@Controller('hello')
export class HelloController {
    @Get()
    async getHello(@Req() req: Request, @Res() res: Response) {
        
        try{
        const axiosResponse = await axios({
            method: 'get',
            url: 'http://localhost:3001/message'
        })

        res.status(axiosResponse.status).send(axiosResponse.data)
    }
    catch(err: any){
        return('failed')
    }
    }
}
