import { Inject } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { RedisClientType } from 'redis';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
  },
  path: '/chat'
})
export class ChatRoomGateway {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
    private readonly prismaService: PrismaService
  ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('status-online')
  statusOnline(@MessageBody() payload: { userId: string }) {
    this.redis.set(`user:${payload.userId}`, "online");

    this.server.emit('status-online', {
      userId: payload.userId,
      status: "online"
    });
  }

  @SubscribeMessage('status-offline')
  statusOffline(@MessageBody() payload: { userId: string }) {
    this.redis.del(`user:${payload.userId}`);

    this.server.emit('status-offline', {
      userId: payload.userId,
      status: "offline"
    });
  }

  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() payload: { authorId: string, content: string }) {
    const message = await this.prismaService.message.create({
      data: {
        content: payload.content,
        authorId: payload.authorId
      },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    this.server.emit('send-message', message);
  }
}
