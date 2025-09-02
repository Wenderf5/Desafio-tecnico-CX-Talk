import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { RedisModule } from './modules/redis/redis.module';
import { ChatRoomModule } from './modules/chat-room/chat-room.module';

@Module({
  imports: [PrismaModule, AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), UserModule, RedisModule, ChatRoomModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
