/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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


    async getRecords(query: any) {
        const { type, category, startDate, endDate, search, page = 1, limit = 10 } = query;

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber - 1) * limitNumber;

        const where = {
            ...(type && { type }),
            ...(category && { category }),
            ...(search && {
                OR: [
                {
                    notes: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
                {
                    category: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
            ],
        }),
        ...(startDate &&
            endDate && {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
            }),
        };

        const [data, total] = await Promise.all([
            this.prisma.financialRecord.findMany({
                where,
                orderBy: { date: 'desc' },
                skip,
                take: limitNumber,
            }),
            this.prisma.financialRecord.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        };
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
