import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ChangeNameDto } from './dto/change-name/change-name.dto';
import { ChangeNameService } from './services/change-name/change-name.service';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { GetAllUsersService } from './services/get-all-users/get-all-users.service';

@Controller('/user')
export class UserController {
    constructor(
        private readonly changeNameService: ChangeNameService,
        private readonly getAllUsersService: GetAllUsersService
    ) { }

    @Post('/change-name')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    changeName(@Body() body: ChangeNameDto, @Req() req: Request) {
        const tokenJwt = req.cookies?.jwt;
        return this.changeNameService.changeName({ newName: body.name, token: tokenJwt });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    getAllUsers() {
        return this.getAllUsersService.getAllUsers();
    }
}
