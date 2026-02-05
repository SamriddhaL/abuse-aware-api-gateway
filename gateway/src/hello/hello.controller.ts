import { Controller, Get, Req, Res } from '@nestjs/common';
import axios from 'axios';
import { count } from 'console';
import type { Request, Response } from 'express';
const requestCount : Record<string, {count: number, lastReset: number}> = {}

@Controller('hello')
export class HelloController {
    @Get()
    async getHello(@Req() req: Request, @Res() res: Response) {
        
        const key = req.ip ?? 'unknown'
        const now = Date.now()

        if (!requestCount[key] || now - requestCount[key].lastReset > 60000){
            requestCount[key] = {
                lastReset: Date.now(),
                count : 1
            }
        }
        else{
            requestCount[key].count += 1
        }
        if (requestCount[key].count > 5){
            res.status(429).json({error: 'Rate limit exceeded'})
        }
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
