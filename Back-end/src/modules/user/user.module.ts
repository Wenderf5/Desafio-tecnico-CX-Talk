import { Module } from '@nestjs/common';
import { UpdateUserService } from './services/update-user/change-name.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { GetAllUsersService } from './services/get-all-users/get-all-users.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [JwtModule, RedisModule],
  providers: [UpdateUserService, GetAllUsersService],
  controllers: [UserController]
})
export class UserModule { }
