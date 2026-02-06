import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLogger } from './request-logger.middleware';
import { HelloModule } from './hello/hello.module';
import { LimiterService } from './limiter/limiter.service';
import { LimiterModule } from './limiter/limiter.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from '@nestjs/config'

@Module({
  imports: [HelloModule, LimiterModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService, LimiterService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogger)
    .forRoutes('*');
  }
}
