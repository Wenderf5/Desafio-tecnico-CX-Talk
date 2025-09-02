import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tokenJwt = request.cookies?.jwt;

    if (!tokenJwt) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      await this.jwtService.verifyAsync(tokenJwt, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
