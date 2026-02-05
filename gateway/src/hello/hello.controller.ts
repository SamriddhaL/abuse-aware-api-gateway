import { Controller, Get, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { count } from 'console';
import type { Request, Response } from 'express';
import { LimiterService } from 'src/limiter/limiter.service';


@Controller('hello')
export class HelloController {
    constructor(private readonly limiterService: LimiterService){}
    @Get()
    async getHello(@Req() req: Request, @Res() res: Response) {
        
        const key = req.ip ?? 'unknown'
        const isAllowed = this.limiterService.isAllowed(key)
        if (!isAllowed){
            return res.status(429).json({error:'Rate Limited'})
        }
        try{
        const axiosResponse = await axios({
            method: 'get',
            url: 'http://localhost:3001/message'
        })

        res.status(axiosResponse.status).send(axiosResponse.data)
    }
    catch(err: any){
        res.status(500).json({error: 'unable to forward'})
    }
    }
}
