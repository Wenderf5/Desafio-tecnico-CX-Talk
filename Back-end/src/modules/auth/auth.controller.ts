import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up/sign-up.dto';
import { SignUpService } from './services/sign-up/sign-up.service';
import type { Request, Response } from 'express';
import { SignInService } from './services/sign-in/sign-in.service';
import { SignInDto } from './dto/sign-in/sign-in.dto';
import { SessionValidateService } from './services/session-validate/session-validate.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly signUpService: SignUpService,
        private readonly signInService: SignInService,
        private readonly sessionValidateService: SessionValidateService
    ) { }

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() body: SignUpDto, @Res({ passthrough: true }) res: Response) {
        const jwtToken = await this.signUpService.signUp(body);

        res.cookie('jwt', jwtToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return {
            statusCode: 201,
            message: 'User created successfully'
        }
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    async signIn(
        @Body() body: SignInDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const token = await this.signInService.signIn(body.email, body.password);

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return {
            statusCode: 200,
            message: 'Login successful'
        }
    }

    @Get("/validate-session")
    @HttpCode(HttpStatus.OK)
    sessionValidation(@Req() req: Request) {
        const token = req.cookies['jwt'];
        return this.sessionValidateService.validate(token);
    }

    @Get("/logout")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        });

        return {
            status: HttpStatus.OK,
            message: "Logout successful"
        }
    }
}
