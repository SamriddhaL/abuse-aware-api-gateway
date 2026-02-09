import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
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
        throw new UnauthorizedException()
      }

      const token = header.split(' ')

      if (token[0] != 'Bearer' || !token[1]){
        throw new UnauthorizedException()
      }

      try{
        const payload = this.jwtService.verify(token[1])
        request.user = payload
        return true
      }
      catch(err){
        throw new UnauthorizedException('invalid or expired jwt token')
      }
  }
}
