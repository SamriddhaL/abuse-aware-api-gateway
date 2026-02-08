import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}
    
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles',context.getHandler())
        const request = context.switchToHttp().getRequest()
        const userRoles = request.user.roles
        
        if (!userRoles){
            return false
        }

        if (requiredRoles.length == 0) return true

        return requiredRoles.some(role => userRoles.includes(role))
    }
}