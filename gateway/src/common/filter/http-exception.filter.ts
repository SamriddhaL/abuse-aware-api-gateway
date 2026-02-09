import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HTTP_CODE_METADATA } from "@nestjs/common/constants";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest()
        const response = host.switchToHttp().getResponse()
        const statusCode = exception.getStatus();
        const res = exception.getResponse()
        const message = typeof res == 'string' ? res : res.message

        response.status(statusCode).json({
            StatusCode: statusCode,
            error: HttpStatus[statusCode],
            message,
            path: request.url,
            timestamp: new Date().toISOString()

        })

    }
}