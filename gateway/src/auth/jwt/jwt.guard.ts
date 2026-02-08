import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(private jwtService: JwtService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();
      const header = request.headers['authorization']
      if (!header){
        return false
      }
      const token = header.split(' ')

      if (token[0] != 'Bearer' || !token[1]){
        return false
      }

      try{
        const payload = this.jwtService.verify(token[1])
        console.log(payload)
        request.user = payload
        return true
      }
      catch(err){
        return false
      }
  }
}
