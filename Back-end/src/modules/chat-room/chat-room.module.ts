import { Module } from '@nestjs/common';
import { GetMessageService } from './services/get-message/get-message.service';
import { ChatRoomGateway } from './chat-room.gateway';
import { ChatRoomController } from './chat-room.controller';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [JwtModule, RedisModule],
  providers: [GetMessageService, ChatRoomGateway],
  controllers: [ChatRoomController]
})
export class ChatRoomModule { }
