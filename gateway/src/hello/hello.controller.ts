import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import axios from 'axios';
import { count } from 'console';
import type { Request, Response } from 'express';
import { ApiGuard } from 'src/api-key.guard';
import { LimiterService } from 'src/limiter/limiter.service';

@UseGuards(ApiGuard)
@Controller('hello')
export class HelloController {
    constructor(private readonly limiterService: LimiterService){}
    @Get()
    async getHello(@Req() req: Request, @Res() res: Response) {
        
        const rawKey = req.headers['x-api-key'] ?? req.ip ?? 'unknown'
        const key = rawKey[0]
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
