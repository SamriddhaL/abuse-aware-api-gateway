import { Module } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';
import { LimiterService } from 'src/limiter/limiter.service';
import { LimiterModule } from 'src/limiter/limiter.module';

@Module({
  controllers: [HelloController],
  providers: [HelloService],
  imports: [LimiterModule]
})
export class HelloModule {}
