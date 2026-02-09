import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const response = context.switchToHttp().getResponse()
        const now = Date.now()
        const method = request.method
        const url = request.url
        request.requestId = randomUUID()
        const user = request.user?.username ?? 'guest'
        return next.handle().pipe(
            tap( data => {
                console.log(`RequestId = ${request.requestId} Method = ${method} ${url} time = ${Date.now() - now} StatusCode: ${response.statusCode} user: ${user}`)
        })
        )
    }
}
