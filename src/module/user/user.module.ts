import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from '../../database/model/user.model';
import { UserRepository } from '../../database/repository/user.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModel, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
