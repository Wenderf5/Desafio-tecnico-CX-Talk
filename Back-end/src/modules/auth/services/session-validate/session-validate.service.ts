import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class SessionValidateService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService
    ) { }

    async validate(token: string) {
        try {
            const payload = this.jwtService.verify(token, { secret: this.configService.get<string>('JWT_SECRET') });
            const userEmail = payload.email;

            const userDB = await this.prismaService.user.findUnique({
                where: {
                    email: userEmail
                }
            });
            if (!userDB) {
                throw new Error();
            }

            return {
                status: HttpStatus.OK,
                message: "Session authorized",
                data: {
                    id: userDB.id,
                    name: userDB.name,
                    photo: userDB.profilePhoto
                }
            }
        } catch (error) {
            throw new UnauthorizedException("Unauthorized session");
        }
    }
}
