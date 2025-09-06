import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetMessageService {
    constructor(private readonly prisma: PrismaService) { }

    async getMessages() {
        const messages = await this.prisma.message.findMany({
            take: 15,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                content: true,
                createdAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        return messages.reverse();
    }
}
