import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { LimiterService } from "./limiter.service";

@Injectable()
export class RateLimiter implements CanActivate{
    constructor(private limiterService: LimiterService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const rawKey = request.headers['x-api-key'] ?? request.ip ?? 'unknown'
        const key = Array.isArray(rawKey) ? rawKey[0] : rawKey
        const isAllowed = this.limiterService.isAllowed(key)
        if (!isAllowed){
            return false
        }
        return true
    }
}