import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import { PrismaService } from '../../../prisma/prisma.service';
import type { user as userDto } from 'generated/prisma';

export interface userWithStatus {
    id: string,
    photo: string;
    name: string;
    status: string;
}

@Injectable()
export class GetAllUsersService {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
        private readonly prismaService: PrismaService
    ) { }

    async getAllUsers() {
        try {
            const usersBD: userDto[] = await this.prismaService.user.findMany();

            const userWithStatus: userWithStatus[] = [];
            for (let i = 0; i < usersBD.length; i++) {
                const status = await this.redis.get(`user:${usersBD[i].id}`);

                userWithStatus.push({
                    id: usersBD[i].id,
                    photo: usersBD[i].profilePhoto,
                    name: usersBD[i].name,
                    status: status || "offline"
                });
            }

            return {
                status: HttpStatus.OK,
                data: userWithStatus
            }
        } catch (error) {
            throw new BadRequestException("Unable to get all users");
        }
    }
}
