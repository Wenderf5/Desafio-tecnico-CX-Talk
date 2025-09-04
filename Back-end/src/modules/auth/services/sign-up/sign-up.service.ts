import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { SignUpDto } from '../../dto/sign-up/sign-up.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { profilePhoto } from '../../../../../generated/prisma';

@Injectable()
export class SignUpService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async signUp(newUser: SignUpDto) {
        const existing = await this.prismaService.user.findUnique({ where: { email: newUser.email } });
        if (existing) {
            throw new ConflictException(`The email '${newUser.email}' is already in use`);
        }

        try {
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            const photoEnum: profilePhoto = profilePhoto[newUser.profilePhoto as keyof typeof profilePhoto] || profilePhoto.PHOTO1;

            await this.prismaService.user.create({
                data: {
                    name: newUser.name,
                    email: newUser.email,
                    password: hashedPassword,
                    profilePhoto: photoEnum
                }
            });

            const payload = { email: newUser.email }
            const tokenJwt = this.jwtService.sign(payload, { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '7d' });

            return tokenJwt;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
