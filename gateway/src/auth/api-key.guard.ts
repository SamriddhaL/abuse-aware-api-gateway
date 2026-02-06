import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
const VALID_API_KEY = ['123ppid', '222ipee']

@Injectable()
export class ApiGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (!apiKey || !VALID_API_KEY.includes(apiKey)){
            return false
        }
        return true

    }
}