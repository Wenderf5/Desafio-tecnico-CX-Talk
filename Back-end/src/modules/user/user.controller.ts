import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user/update-user.dto';
import { UpdateUserService } from './services/update-user/change-name.service';
import type { Request } from 'express';
import { AuthGuard } from '../../common/guards/auth/auth.guard';
import { GetAllUsersService } from './services/get-all-users/get-all-users.service';

@Controller('/user')
export class UserController {
    constructor(
        private readonly updateUserService: UpdateUserService,
        private readonly getAllUsersService: GetAllUsersService
    ) { }

    @Patch('/')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    changeName(@Body() body: UpdateUserDto, @Req() req: Request) {
        const tokenJwt = req.cookies?.jwt;
        return this.updateUserService.updateUser({ newName: body.name, token: tokenJwt });
    }

    @Get('/')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    getAllUsers() {
        return this.getAllUsersService.getAllUsers();
    }
}
