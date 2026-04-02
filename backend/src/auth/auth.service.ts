/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}

    generateToken(userId: string, role: string) {
        return this.jwtService.sign({sub: userId, role});
    }
}

