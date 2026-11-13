import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from '../../database/model/user.model';
import { UserRepository } from '../../database/repository/user.repository';
import { RedisService } from '../../common/services/redis.service';
import { SendEmailService } from '../../common/services/send-email.service';
import { TokenService } from '../../common/services/token.service';

@Module({
  imports: [
    UserModel,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    RedisService,
    SendEmailService,
    TokenService,
  ],
  exports: [AuthService, UserRepository, TokenService, RedisService],
})
export class AuthModule {}
