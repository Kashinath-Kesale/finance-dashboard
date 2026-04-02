/* eslint-disable prettier/prettier */
import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('token')
    generateToken(@Query('userId') userId: string, @Query('role') role: string,) {
        return this.authService.generateToken(userId, role);
    }
}
