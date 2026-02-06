import { Inject, Module } from '@nestjs/common';
import { Auth } from './auth';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [Auth],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>({
      secret: config.get('JWT_SECRET_KEY'),
      signOptions: { expiresIn: '1h'}
    }
  )
  }
  )
  ]
})
export class AuthModule {}
