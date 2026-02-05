import { MiddlewareConsumer, NestMiddleware } from "@nestjs/common";

export class RequestLogger implements NestMiddleware{
    use(req: any, res: any, next: (error?: any) => void) {
        const method = req.method;
        const test = req.originalUrl;
        const ip = req.ip;
        console.log(method, test, ip)
        next()
    }

}