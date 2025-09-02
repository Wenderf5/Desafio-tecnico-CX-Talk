import { Module } from '@nestjs/common';
import { ChangeNameService } from './services/change-name/change-name.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { GetAllUsersService } from './services/get-all-users/get-all-users.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [JwtModule, RedisModule],
  providers: [ChangeNameService, GetAllUsersService],
  controllers: [UserController]
})
export class UserModule { }
