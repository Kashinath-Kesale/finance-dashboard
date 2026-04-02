/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException,} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';


@Injectable()
export class RecordsService {
    constructor(private prisma: PrismaService) {}

    async createRecord(userId: string, dto: CreateRecordDto) {
        return this.prisma.financialRecord.create({
            data: {
                userId,
                amount: dto.amount,
                type: dto.type,
                category: dto.category,
                date: new Date(dto.date),
                notes: dto.notes,
            },
        });
    }


    async getRecords(filters: any) {
        const { type, category, startDate, endDate } = filters;

        return this.prisma.financialRecord.findMany({
            where: {
                ...(type && { type }),
                ...(category && { category }),
                ...(startDate && endDate && {
                    date: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                }),
            },

            orderBy: { date: 'desc' },
        });
    }


    async updateRecord(id: string, dto: UpdateRecordDto) {
        const record = await this.prisma.financialRecord.findUnique({where: {id}});

        if(!record) throw new NotFoundException('Record not found');

        return this.prisma.financialRecord.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.date && { date: new Date(dto.date) }),
            },
        });
    }


    async deleteRecord(id: string) {
        const record = await this.prisma.financialRecord.findUnique({
            where: {id}
        });

        if(!record) throw new NotFoundException('Record not found');

        return this.prisma.financialRecord.delete({where: {id}});
    }
}
