import { Controller, Get, Param } from '@nestjs/common';

@Controller('message')
export class MessageController {
    @Get()
    get(){
        return 'Message sent from api'
    }
}
