/* eslint-disable prettier/prettier */
import { Body,Controller, Delete, Get, Param,Patch,Post,Query,Req,UseGuards,} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';



@Controller('records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RecordsController {
    constructor(private recordsService: RecordsService) {}

    @Post()
    @Roles('ADMIN')
    create(@Req() req, @Body() dto: CreateRecordDto) {
        return this.recordsService.createRecord(req.user.sub, dto);
    }


    @Get()
    @Roles('ANALYST', 'ADMIN')
    getRecords(@Query() query) {
        return this.recordsService.getRecords(query);
    }


    @Patch(':id')
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() dto: UpdateRecordDto) {
        return this.recordsService.updateRecord(id, dto);
    }


    @Delete(':id')
    @Roles('ADMIN')
    delete(@Param('id') id: string) {
        return this.recordsService.deleteRecord(id);
    }
}
