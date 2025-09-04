import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChangeNameService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async changeName(body: { newName: string, token: string }) {
        try {
            const payload = await this.jwtService.verifyAsync(body.token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            await this.prismaService.user.update({
                where: {
                    email: payload.email
                },
                data: {
                    name: body.newName
                }
            });

            return {
                status: HttpStatus.OK,
                message: "Username updated successfully"
            }
        } catch (error) {
            throw new BadRequestException("Error updating username");
        }
    }
}
