import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class GetMessageService {
    constructor(private readonly prisma: PrismaService) { }

    async getMessages() {
        const messages = await this.prisma.message.findMany({
            take: 15,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { name: true }
                }
            }
        });

        return messages.reverse();
    }
}
