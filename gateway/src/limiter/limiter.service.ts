import { Injectable } from '@nestjs/common';
const requestCount : Record<string, {
    count: number, 
    lastReset: number,
    violations: number,
    blockedUntil: number 
}> = {}

@Injectable()
export class LimiterService {
    isAllowed(key: string){
        const now = Date.now()
        if (!requestCount[key]){
            requestCount[key] = {
                count: 1,
                lastReset: now,
                violations: 0,
                blockedUntil: 0
            }
        }

        if (requestCount[key].blockedUntil > now){
            console.log(`[BLOCK] key =${key} count = ${requestCount[key].count} violations = ${requestCount[key].violations} blockedUntil = ${requestCount[key].blockedUntil}`)
            return(false)
        }

        if (now - requestCount[key].lastReset < 60000){
            requestCount[key].count += 1
        }
        else{
            requestCount[key].lastReset = now,
            requestCount[key].count = 1
        }

        if (requestCount[key].count > 5){
            requestCount[key].violations +=1

            if (requestCount[key].violations >= 3){
                requestCount[key].blockedUntil = now + 350000
                requestCount[key].violations = 0
            }

            console.log(`[BLOCK] key =${key} count = ${requestCount[key].count} violations = ${requestCount[key].violations} blockedUntil = ${requestCount[key].blockedUntil}` )
            return(false)
        }
        else{
            console.log(`[ALLOW] key =${key} count = ${requestCount[key].count} violations = ${requestCount[key].violations} blockedUntil = ${requestCount[key].blockedUntil}` )
            return(true)
        }
    }
}
