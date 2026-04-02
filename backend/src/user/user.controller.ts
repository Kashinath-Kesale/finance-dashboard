/* eslint-disable prettier/prettier */
import { Body, Controller,Get,Param,Patch, Post,} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';


@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}    

    @Roles('ADMIN')
    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto);
    }

    @Roles('ADMIN')
    @Get()
    getUsers() {
        return this.userService.getUsers();
    }

    @Roles('ADMIN')
    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto);
    }
}