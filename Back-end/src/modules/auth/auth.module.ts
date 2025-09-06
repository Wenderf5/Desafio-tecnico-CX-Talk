import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignUpService } from './services/sign-up/sign-up.service';
import { SignInService } from './services/sign-in/sign-in.service';
import { JwtModule } from '@nestjs/jwt';
import { SessionValidateService } from './services/session-validate/session-validate.service';

@Module({
  imports: [JwtModule],
  providers: [
    SignUpService,
    SignInService,
    SessionValidateService
  ],
  controllers: [AuthController]
})
export class AuthModule { }
