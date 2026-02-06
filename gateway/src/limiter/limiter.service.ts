import { Injectable } from '@nestjs/common';
import { count } from 'console';
const requestCount : Record<string, {count: number, lastReset: number}> = {}

@Injectable()
export class LimiterService {
    isAllowed(key: string){
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
            console.log(`[BLOCK] key =${key} count = ${count}` )
            return(false)
        }
        else{
            console.log(`[ALLOW] key =${key} count = ${count}` )
            return(true)
        }
    }
}
