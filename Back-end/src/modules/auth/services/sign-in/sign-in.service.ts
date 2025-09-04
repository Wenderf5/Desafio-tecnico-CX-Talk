import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignInService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signIn(email: string, password: string) {
        const existing = await this.prismaService.user.findUnique({ where: { email: email } });
        if (!existing) {
            throw new NotFoundException("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, existing.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { email: existing.email }
        const tokenJwt = this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '7d' });

        return tokenJwt;
    }
}
