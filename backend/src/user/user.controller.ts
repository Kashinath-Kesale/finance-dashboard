/* eslint-disable prettier/prettier */
import { Body, Controller,Get,Param,Patch, Post,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}    

    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }

    @Get()
    getUsers() {
        return this.userService.getUsers();
    }


    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto);
    }
}