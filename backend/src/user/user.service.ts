/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser(dto: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                role: dto.role,
            }
        })
    }


    async getUsers() {
        return this.prisma.user.findMany();
    }


    async updateUser(id: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where : {id}
        });

        if(!user) throw new NotFoundException('User not found');

        return this.prisma.user.update({
            where : {id},
            data :dto,
        })
    }
}

