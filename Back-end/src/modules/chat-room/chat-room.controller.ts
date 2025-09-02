import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { GetMessageService } from './services/get-message/get-message.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('/chat-room')
export class ChatRoomController {
    constructor(private readonly getMessageService: GetMessageService) { }

    @Get('/message')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    getMessage() {
        return this.getMessageService.getMessages();
    }
}
